"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";

import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRules = [
        {
            label: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
            valid: password.length >= 8,
        },
        {
            label: "ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว",
            valid: /[a-z]/.test(password),
        },
        {
            label: "ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "ต้องมีตัวเลขอย่างน้อย 1 ตัว",
            valid: /\d/.test(password),
        },
        {
            label: "ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว",
            valid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const isPasswordValid = passwordRules.every((rule) => rule.valid);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!isPasswordValid) {
            setError("กรุณาตั้งรหัสผ่านให้ตรงตามเงื่อนไข");
            return;
        }

        if (password !== confirmPassword) {
            setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                }),
        });

        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-900">
                ลงทะเบียนเข้าใช้ระบบฟรี
            </h1>
            <p className="mt-3 text-gray-600">
                ลงทะเบียนเข้าใช้ระบบแล้วมาเริ่มกัน
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">
                        First Name / ชื่อ
                    </label>
                    <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2 focus-within:border-[#0A84E8] focus-within:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]">
                        <User className="h-5 w-5 text-gray-900" />
                        <input
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            className="w-full bg-transparent text-gray-900 outline-none"
                            placeholder="ชื่อ"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">
                        Last Name / นามสกุล
                    </label>
                    <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2 focus-within:border-[#0A84E8] focus-within:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]">
                        <User className="h-5 w-5 text-gray-900" />
                        <input
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            className="w-full bg-transparent text-gray-900 outline-none"
                            placeholder="นามสกุล"
                            required
                        />
                    </div>
                </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">
                        Email Address / ที่อยู่อีเมล
                    </label>
                    <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2 focus-within:border-[#0A84E8] focus-within:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]">
                        <Mail className="h-5 w-5 text-gray-900" />
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            className="w-full bg-transparent text-gray-900 outline-none"
                            placeholder="somchai@example.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">
                        Password / รหัสผ่าน
                    </label>
                    <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2 focus-within:border-[#0A84E8] focus-within:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]">
                        <Lock className="h-5 w-5 text-gray-900" />
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="w-full bg-transparent text-gray-900 outline-none"
                            placeholder="กรอกรหัสผ่าน"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="text-gray-700 transition hover:text-[#0A84E8]"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                            <Eye className="h-5 w-5" />
                            ) : (
                            <EyeOff className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <ul className="mt-3 space-y-1.5">
                        {passwordRules.map((rule) => (
                            <li
                            key={rule.label}
                            className={`flex items-center gap-2 text-xs font-medium ${
                                rule.valid ? "text-green-600" : "text-gray-500"
                            }`}
                            >
                            {rule.valid ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <X className="h-4 w-4" />
                            )}
                            <span>{rule.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-gray-900">
                        Confirm Password / ยืนยันรหัสผ่าน
                    </label>
                    <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2 focus-within:border-[#0A84E8] focus-within:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]">
                    <Lock className="h-5 w-5 text-gray-900" />
                        <input
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="w-full bg-transparent text-gray-900 outline-none"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            className="text-gray-700 transition hover:text-[#0A84E8]"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? (
                            <Eye className="h-5 w-5" />
                            ) : (
                            <EyeOff className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {confirmPassword && (
                        <p
                            className={`mt-2 text-xs font-medium ${
                            password === confirmPassword ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {password === confirmPassword
                            ? "รหัสผ่านตรงกัน"
                            : "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน"}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading || !isPasswordValid || password !== confirmPassword}
                    className="w-full rounded-full bg-gradient-to-r from-[#0B6DDE] to-[#10AEE8] px-5 py-3 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "กำลังลงทะเบียน..." : "Sign Up / ลงทะเบียนเข้าใช้"}
                </button>
            </form>

            <p className="mt-8 text-center text-sm font-bold text-gray-900">
                Already have an account?{" "}
                <Link href="/login" className="text-[#0A84E8] hover:underline">
                    Sign In.
                </Link>
            </p>
        </div>
    );
}