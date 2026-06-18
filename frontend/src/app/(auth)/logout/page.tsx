"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

export default function LogoutPage() {
    const router = useRouter();
    const { logout } = useAuth();

    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);

        try {
            await logout();
            await wait(1000);
            router.replace("/");
        } finally {
            setLoading(false);
        }
    }

    function wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    

    return (
        <div className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <LogOut className="h-7 w-7" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900">
                ออกจากระบบ
            </h1>

            <p className="mt-3 text-gray-600">
                แน่ใจหรือไม่ว่าต้องการออกจากระบบ?
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="rounded-full border border-gray-900 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    ยกเลิก
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
                </button>
            </div>
        </div>
    );
}