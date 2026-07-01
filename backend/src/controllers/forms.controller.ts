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
                review: {
                    info:
                        form.review?.info ?? { status: "pending", note: "" },
                    companyCertificate:
                        form.review?.companyCertificate ?? { status: "pending", note: "" },
                    citizenIdCard:
                        form.review?.citizenIdCard ?? { status: "pending", note: "" },
                    faceScan:
                        form.review?.faceScan ?? { status: "pending", note: "" },
                    bankBook:
                        form.review?.bankBook ?? { status: "pending", note: "" },
                },
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

export async function getFormDetail(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const { formId } = req.params;

        const form = await FormModel.findOne({
            _id: formId,
            cognitoSub: req.user.cognitoSub, //กัน user A โหลด user B
        }).lean();

        if (!form) {
            return res.status(404).json({
                message: "Form not found",
            });
        }

        return res.json({
            form: {
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
                review: {
                    info: form.review?.info ?? { status: "pending", note: "" },
                    companyCertificate:
                        form.review?.companyCertificate ?? { status: "pending", note: "" },
                    citizenIdCard:
                        form.review?.citizenIdCard ?? { status: "pending", note: "" },
                    faceScan:
                        form.review?.faceScan ?? { status: "pending", note: "" },
                    bankBook:
                        form.review?.bankBook ?? { status: "pending", note: "" },
                },
                submittedAt: form.submittedAt,
                updatedAt: form.updatedAt,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : "Failed to get form detail",
        });
    }
}

async function uploadNewFile(file: Express.Multer.File | null) {
    if (!file) return null;

    return uploadBufferToGridFS({
        buffer: file.buffer,
        filename: file.originalname,
        contentType: file.mimetype,
    });
}

export async function resubmitForm(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const { formId } = req.params;

        const existingForm = await FormModel.findOne({
            _id: formId,
            cognitoSub: req.user.cognitoSub,
        });

        if (!existingForm) {
            return res.status(404).json({
                message: "Form not found",
            });
        }

        const files = req.files as MulterFiles | undefined;

        const companyCertificate = getUploadedFile(files, "companyCertificate");
        const citizenIdCard = getUploadedFile(files, "citizenIdCard");
        const bankBook = getUploadedFile(files, "bankBook");
        const faceScan = getUploadedFile(files, "faceScan");

        //check rejected file ก่อน save
        const reviewFileFields: UploadField[] = [
            "companyCertificate",
            "citizenIdCard",
            "bankBook",
            "faceScan",
        ];

        for (const field of reviewFileFields) {
            const isRejected = existingForm.review?.[field]?.status === "rejected";
            const uploadedFile = getUploadedFile(files, field);

            if (isRejected && !uploadedFile) {
                return res.status(400).json({
                    message: `Please upload rejected file: ${field}`,
                });
            }
        }

        const [
            storedCompanyCertificate,
            storedCitizenIdCard,
            storedBankBook,
            storedFaceScan,
        ] = await Promise.all([
            uploadNewFile(companyCertificate),
            uploadNewFile(citizenIdCard),
            uploadNewFile(bankBook),
            uploadNewFile(faceScan),
        ]);

        const nextFiles = {
            companyCertificate:
                storedCompanyCertificate ?? existingForm.files.companyCertificate,
            citizenIdCard:
                storedCitizenIdCard ?? existingForm.files.citizenIdCard,
            bankBook:
                storedBankBook ?? existingForm.files.bankBook,
            faceScan:
                storedFaceScan ?? existingForm.files.faceScan,
        };

        const nextReview = {
            info: existingForm.review.info,
            companyCertificate: existingForm.review.companyCertificate,
            citizenIdCard: existingForm.review.citizenIdCard,
            faceScan: existingForm.review.faceScan,
            bankBook: existingForm.review.bankBook,
        };

        if (existingForm.review.info?.status === "rejected") {
            nextReview.info = { status: "pending", note: "" };
        }

        if (companyCertificate) {
            nextReview.companyCertificate = { status: "pending", note: "" };
        }

        if (citizenIdCard) {
            nextReview.citizenIdCard = { status: "pending", note: "" };
        }

        if (faceScan) {
            nextReview.faceScan = { status: "pending", note: "" };
        }

        if (bankBook) {
            nextReview.bankBook = { status: "pending", note: "" };
        }

        existingForm.set({
            status: "under_review",

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

            files: nextFiles,

            review: nextReview,

            faceVerification: parseFaceVerification(req.body.faceVerification),
            submittedAt: new Date(),
        });

        const form = await existingForm.save();

        return res.json({
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
            message:
                error instanceof Error ? error.message : "Failed to resubmit form",
        });
    }
}