"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
        <h1 className="text-4xl font-bold text-gray-900">ลงทะเบียนเข้าใช้ระบบฟรี</h1>
        <p className="mt-3 text-gray-600">ลงทะเบียนเข้าใช้ระบบแล้วมาเริ่มกัน</p>

        <form className="mt-10 space-y-7">
            <div>
            <label className="mb-2 block text-sm font-bold text-gray-900">
                Username / ชื่อผู้ใช้
            </label>
            <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2">
                <User className="h-5 w-5 text-gray-900" />
                <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-transparent text-gray-900 outline-none"
                placeholder="กรุณากรอกชื่อผู้ใช้"
                />
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
                className="w-full bg-transparent text-gray-900 outline-none"
                placeholder="กรุณากรอกที่อยู่อีเมล"
                />
            </div>
            </div>

            <div>
            <label className="mb-2 block text-sm font-bold text-gray-900">
                Password / รหัสผ่าน
            </label>
            <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2">
                <Lock className="h-5 w-5 text-gray-900" />
                <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="w-full bg-transparent text-gray-900 outline-none"
                placeholder="กรอกรหัสผ่าน"
                />
            </div>
            </div>

            <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[#0B6DDE] to-[#10AEE8] px-5 py-3 font-bold text-white"
            >
            Sign Up / ลงทะเบียนเข้าใช้
            </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-gray-900">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0A84E8]">
            Sign In.
            </Link>
        </p>
        </div>
    );
}