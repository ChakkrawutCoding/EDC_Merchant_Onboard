import type { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID!,
    clientId: process.env.COGNITO_CLIENT_ID!,
    tokenUse: "access",
});

export interface AuthRequest extends Request {
    user?: {
        cognitoSub: string;
        email?: string;
    };
}

export async function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.accessToken;

    if (!token) { //ถ้าไม่มี Token
        return res.status(401).json({
            message: "No token provided",
        });
    }

    try {
        const payload = await verifier.verify(token); //verify token ด้วย Cognito

        req.user = {
            cognitoSub: payload.sub,
            email: typeof payload.email === "string" ? payload.email : undefined,
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

/*
Flow :
- อ่าน accessToken จาก cookie
- verify ด้วย CognitoJwtVerifier
- ถ้าผ่าน ใส่ req.user.cognitoSub
- ถ้าไม่ผ่าน ตอบ 401
*/