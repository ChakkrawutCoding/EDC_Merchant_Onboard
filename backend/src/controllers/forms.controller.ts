import type { Response } from "express";

import { FormModel } from "../models/form.model";
import type { AuthRequest } from "../middleware/auth.middleware";
import {
    findGridFile,
    openDownloadStream,
    uploadBufferToGridFS,
} from "../services/gridfs.service";

type UploadField =
    | "companyCertificate"
    | "citizenIdCard"
    | "bankBook"
    | "faceScan";

    
type MulterFiles =
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };

function getUploadedFile(
    files: MulterFiles | undefined,
    fieldName: UploadField
) {
    if (!files) return null;

    if (Array.isArray(files)) {
        return files.find((file) => file.fieldname === fieldName) ?? null;
    }

    return files[fieldName]?.[0] ?? null;
}

function parseFaceVerification(value: unknown) {
    if (!value || typeof value !== "string") {
        return {
            matched: false,
            score: 0,
        };
    }

    try {
        const parsed = JSON.parse(value) as {
            matched?: boolean;
            score?: number;
            checkedAt?: string;
        };

        return {
            matched: Boolean(parsed.matched),
            score: Number(parsed.score ?? 0),
            checkedAt: parsed.checkedAt ? new Date(parsed.checkedAt) : undefined,
        };
    } catch {
        return {
            matched: false,
            score: 0,
        };
    }
}

export async function submitForm(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const files = req.files as MulterFiles | undefined;

        const companyCertificate = getUploadedFile(files, "companyCertificate")
        const citizenIdCard = getUploadedFile(files, "citizenIdCard");
        const bankBook = getUploadedFile(files, "bankBook");
        const faceScan = getUploadedFile(files, "faceScan");

        if (!companyCertificate || !citizenIdCard || !bankBook || !faceScan) {
            return res.status(400).json({
                message: "Company certificate, citizen ID card, bank book, and face scan are required",
            });
        }

        const [
            storedCompanyCertificate,
            storedCitizenIdCard,
            storedBankBook,
            storedFaceScan,
        ] = await Promise.all([
            uploadBufferToGridFS({
                buffer: companyCertificate.buffer,
                filename: companyCertificate.originalname,
                contentType: companyCertificate.mimetype
            }),
            uploadBufferToGridFS({
                buffer: citizenIdCard.buffer,
                filename: citizenIdCard.originalname,
                contentType: citizenIdCard.mimetype,
            }),
            uploadBufferToGridFS({
                buffer: bankBook.buffer,
                filename: bankBook.originalname,
                contentType: bankBook.mimetype,
            }),
            faceScan
                ? uploadBufferToGridFS({
                    buffer: faceScan.buffer,
                    filename: faceScan.originalname,
                    contentType: faceScan.mimetype,
                })
                : Promise.resolve(null),
        ]);

        const form = await FormModel.create({
            cognitoSub: req.user.cognitoSub,

            businessName: req.body.businessName,
            businessType: req.body.businessType,
            otherBusinessType: req.body.otherBusinessType ?? "",
            taxId: req.body.taxId,
            tel: req.body.tel,
            businessAddress: req.body.businessAddress,
            road: req.body.road ?? "",
            province: req.body.province,
            district: req.body.district,
            subDistrict: req.body.subDistrict,
            zipcode: req.body.zipcode,

            files: {
                companyCertificate: storedCompanyCertificate,
                citizenIdCard: storedCitizenIdCard,
                bankBook: storedBankBook,
                faceScan: storedFaceScan,
            },

            faceVerification: parseFaceVerification(req.body.faceVerification),
        });

        return res.status(201).json({
            form: {
                id: String(form._id),
                status: form.status,
                businessName: form.businessName,
                taxId: form.taxId,
                submittedAt: form.submittedAt,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to submit form",
        });
    }
}

export async function listForms(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const forms = await FormModel.find({
            cognitoSub: req.user.cognitoSub,
        }).sort({ submittedAt: -1 }).lean();

        return res.json({
            forms: forms.map((form) => ({
                id: String(form._id),
                status: form.status,
                businessName: form.businessName,
                businessType: form.businessType,
                otherBusinessType: form.otherBusinessType,
                taxId: form.taxId,
                tel: form.tel,
                businessAddress: form.businessAddress,
                road: form.road,
                province: form.province,
                district: form.district,
                subDistrict: form.subDistrict,
                zipcode: form.zipcode,
                submittedAt: form.submittedAt,
                updatedAt: form.updatedAt,
            })),
        })

    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to list forms",
        });
    }
}

export async function getFormFile(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const { formId, fileKey } = req.params;

        if (
            fileKey !== "companyCertificate" &&
            fileKey !== "citizenIdCard" &&
            fileKey !== "bankBook" &&
            fileKey !== "faceScan"
        ) {
            return res.status(400).json({
                message: "Invalid file key",
            });
        }

        const form = await FormModel.findOne({
            _id: formId,
            cognitoSub: req.user.cognitoSub,
        });

        if (!form) {
            return res.status(404).json({
                message: "Form not found",
            });
        }

        const file = form.files?.[fileKey];

        if (!file) {
            return res.status(404).json({
                message: "File not found",
            });
        }

        const gridFile = await findGridFile(String(file.fileId));

        if (!gridFile) {
            return res.status(404).json({
                message: "Stored file not found",
            });
        }

        res.setHeader("Content-Type", file.type);
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${encodeURIComponent(file.name)}"`
        );

        const stream = openDownloadStream(String(file.fileId));
        
        return stream.pipe(res);

    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to get file",
        });
    }
}