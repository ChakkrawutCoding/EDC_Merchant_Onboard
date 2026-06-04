import type { Request, Response } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user.model";

const cookieName = "edc_auth_token";

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    return secret;
}

function signAuthToken(userId: string) {
    return jwt.sign({ userId }, getJwtSecret(), {
        expiresIn: "7d",
    });
}

function setAuthCookie(res: Response, token: string) {
    res.cookie(cookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

function toPublicUser(user: {
    _id: unknown;
    name: string;
    email: string;
}) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
    };
}

export async function register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required",
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters",
        });
    }

    const existingUser = await UserModel.findOne({
        email: String(email).toLowerCase(),
    })

    if (existingUser) {
        return res.status(409).json({
            message: "Email is already registered",
        });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
        name,
        email,
        passwordHash,
    });

    const token = signAuthToken(String(user._id));
    setAuthCookie(res, token);

    return res.status(201).json({
        user: toPublicUser(user),
    });
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const user = await UserModel.findOne({
        email: String(email).toLowerCase(),
    });

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    const token = signAuthToken(String(user._id));
    setAuthCookie(res, token);

    return res.json({
        user: toPublicUser(user),
    });
}

export async function getMe(req: Request, res: Response) {
    const token = req.cookies?.[cookieName];

    if (!token) {
        return res.status(401).json({
            user: null,
        });
    }

    try {
        const payload = jwt.verify(token, getJwtSecret()) as { userId: string };
        const user = await UserModel.findById(payload.userId);

        if (!user) {
            return res.status(401).json({
                user: null,
            });
        }

        return res.json({
            user: toPublicUser(user),
        });
    } catch {
        return res.status(401).json({
            user: null,
        });
    }
}

export function logout(req: Request, res: Response) {
    res.clearCookie(cookieName, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    return res.json({
        message: "Logged out",
    });
}