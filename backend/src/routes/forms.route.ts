import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  getFormFile,
  listForms,
  submitForm,
} from "../controllers/forms.controller";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 4,
    },
});

const formFiles = upload.fields([
    { name: "companyCertificate", maxCount: 1 },
    { name: "citizenIdCard", maxCount: 1 },
    { name: "bankBook", maxCount: 1 },
    { name: "faceScan", maxCount: 1 },
]);

router.post("/", authMiddleware, formFiles, submitForm);
router.get("/", authMiddleware, listForms);
router.get("/:formId/files/:fileKey", authMiddleware, getFormFile);

export default router;