import { Router } from "express";

import {
    getMe,
    login,
    logout,
    register,
    verifyEmail,
    resendVerification,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);

export default router;