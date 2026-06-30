import { Schema, model, models, type InferSchemaType } from "mongoose";

export type FormStatus =
    | "editing"
    | "pending"
    | "under_review"
    | "approved"
    | "rejected";

export type ReviewStatus =
    | "pending"
    | "approved"
    | "rejected";

const uploadedFileSchema = new Schema(
    {
        fileId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
            trim: true,
        },

        size: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const reviewItemSchema = new Schema(
    {
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true,
        },

        note: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        reviewedAt: {
            type: Date,
        },
    },
    {
        _id: false,
    }
);

const formSchema = new Schema(
    {
        cognitoSub: {
            type: String,
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["editing", "pending", "under_review", "approved", "rejected"],
            default: "pending", // Use editing later if server-side drafts are added.
            required: true,
            index: true,
        },

        businessName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255,
        },

        businessType: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },

        otherBusinessType: {
            type: String,
            trim: true,
            maxlength: 120,
            default: "",
        },

        taxId: {
            type: String,
            required: true,
            trim: true,
            maxlength: 13,
        },

        tel: {
            type: String,
            required: true,
            trim: true,
            maxlength: 10,
        },

        businessAddress: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        road: {
            type: String,
            trim: true,
            maxlength: 255,
            default: "",
        },

        province: {
            type: String,
            required: true,
            trim: true,
        },

        district: {
            type: String,
            required: true,
            trim: true,
        },

        subDistrict: {
            type: String,
            required: true,
            trim: true,
        },

        zipcode: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5,
        },

        files: {
            companyCertificate: {
                type: uploadedFileSchema,
                required: true,
            },

            citizenIdCard: {
                type: uploadedFileSchema,
                required: true,
            },

            bankBook: {
                type: uploadedFileSchema,
                required: true,
            },

            faceScan: {
                type: uploadedFileSchema,
                required: true,
            },
        },

        review: {
            info: {
                type: reviewItemSchema,
                default: () => ({}),
            },

            companyCertificate: {
                type: reviewItemSchema,
                default: () => ({}),
            },

            citizenIdCard: {
                type: reviewItemSchema,
                default: () => ({}),
            },

            faceScan: {
                type: reviewItemSchema,
                default: () => ({}),
            },

            bankBook: {
                type: reviewItemSchema,
                default: () => ({}),
            },
        },

        faceVerification: {
            matched: {
                type: Boolean,
                default: false,
            },

            score: {
                type: Number,
                default: 0,
            },

            checkedAt: {
                type: Date,
            },
        },

        submittedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export type KycForm = InferSchemaType<typeof formSchema>;

export const FormModel = models.Form || model("Form", formSchema);