import type { Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { UserModel } from "../models/user.model";
import {
    cognitoSignUp,
    cognitoConfirmSignUp,
    cognitoLogin,
    cognitoGlobalSignOut,
    cognitoResendConfirmationCode,
} from "../services/cognito.service";

const ACCESS_TOKEN_COOKIE = "accessToken";
const ID_TOKEN_COOKIE = "idToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax" as const,
};

function setTokenCookies(
    res: Response,
    tokens: {
        accessToken: string;
        idToken: string;
        refreshToken: string;
    }
) {
    res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 1000,
    });

    res.cookie(ID_TOKEN_COOKIE, tokens.idToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 1000,
    });

    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}

function clearTokenCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS);
    res.clearCookie(ID_TOKEN_COOKIE, COOKIE_OPTIONS);
    res.clearCookie(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
}

const idVerifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    tokenUse: "id",
});

async function upsertUserFromIdToken(idToken: string) {
    const payload = await idVerifier.verify(idToken);

    const email = String(payload.email || "").toLowerCase();
    const firstName = String(payload.given_name || "");
    const lastName = String(payload.family_name || "");
    const name = `${firstName} ${lastName}`.trim() || email;

    const existingUser = await UserModel.findOne({
        $or: [
            { cognitoSub: payload.sub },
            { email },
        ],
    });

    if (existingUser) {
        existingUser.set({
            cognitoSub: payload.sub,
            email,
            firstName,
            lastName,
            name,
            provider: "email",
        });

        return existingUser.save();
    }

    return UserModel.create({
        cognitoSub: payload.sub,
        email,
        firstName,
        lastName,
        name,
        provider: "email",
    });
}

function toPublicUser(user: {
    _id: unknown;
    cognitoSub: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
}) {
    return {
        id: String(user._id),
        cognitoSub: user.cognitoSub,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
    };
}

/*
POST /auth/register
- backend เรียก cognitoSignUp
- Cognito ส่ง verification code ไป email
*/
export async function register(req: Request, res: Response) {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "Email, password, firstName, and lastName are required",
            });
        }

        await cognitoSignUp({
            email: String(email).toLowerCase(),
            password: String(password),
            firstName: String(firstName),
            lastName: String(lastName),
        });

        return res.status(201).json({
            message: "Registration successful. Check your email for the verification code.",
        });
    } catch (error) {
            return res.status(400).json({
            message: error instanceof Error ? error.message : "Registration failed",
        });
    }
}

/*
POST /auth/verify-email
- backend เรียก cognitoConfirmSignUp
- user ใน Cognito กลายเป็น confirmed
*/
export async function verifyEmail(req: Request, res: Response) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                message: "Email and verification code are required",
            });
        }

        await cognitoConfirmSignUp(String(email).toLowerCase(), String(code));

        return res.json({
            message: "Email verified. You can now log in.",
        });
    } catch (error) {
            return res.status(400).json({
            message: error instanceof Error ? error.message : "Email verification failed",
        });
    }
}

/*
POST /auth/login
- backend เรียก cognitoLogin
- ได้ accessToken, idToken, refreshToken
- backend set เป็น HttpOnly cookies
- backend verify idToken แล้ว upsert user ลง MongoDB
*/
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const tokens = await cognitoLogin(
            String(email).toLowerCase(),
            String(password)
        );

        setTokenCookies(res, tokens);

        const user = await upsertUserFromIdToken(tokens.idToken);

        return res.json({
            user: toPublicUser(user),
        });
    } catch (error) {
            return res.status(401).json({
            message: error instanceof Error ? error.message : "Login failed",
        });
    }
}

/*
GET /auth/me
- backend อ่าน idToken จาก cookie
- verify กับ Cognito
- sync/find user ใน MongoDB
- ส่ง user กลับ frontend
*/
export async function getMe(req: Request, res: Response) {
    try {
        const idToken = req.cookies?.[ID_TOKEN_COOKIE];

        if (!idToken) {
        return res.status(401).json({
            user: null,
        });
        }

        const user = await upsertUserFromIdToken(idToken);

        return res.json({
            user: toPublicUser(user),
        });
    } catch {
        return res.status(401).json({
            user: null,
        });
    }
}

/*
POST /auth/logout
- backend เรียก cognitoGlobalSignOut
- clear cookies
*/
export async function logout(req: Request, res: Response) {
    const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE];

    if (accessToken) {
        try {
        await cognitoGlobalSignOut(accessToken);
        } catch {
            // ถ้า token หมดอายุแล้ว ก็ยังควร clear cookie อยู่ดี
        }
    }

    clearTokenCookies(res);

    return res.json({
        message: "Logged out",
    });
}

export async function resendVerification(req: Request, res: Response) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        await cognitoResendConfirmationCode(String(email).toLowerCase());

        return res.json({
            message: "Verification code resent. Please check your email.",
        });
    } catch (error) {
        return res.status(400).json({
        message:
            error instanceof Error
                ? error.message
                : "Failed to resend verification code",
        });
    }
}