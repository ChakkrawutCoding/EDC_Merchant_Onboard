"use client"

import Navbar from "@/components/layout/Navbar";

import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function StatusPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);
    
    if (loading || !user) {
        return (
            <main className="min-h-screen bg-[#EAF5FB]">
                <Navbar />
    
                <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
                    <p className="text-center text-gray-600">
                        กำลังตรวจสอบสิทธิ์...
                    </p>
                </section>
            </main>
        );
    } else {
        return (
            <main className="min-h-screen bg-[#EAF5FB]">
                <Navbar />

                <section className="mx-auto max-w-7xl px-6 py-16">
                    <h1>Status Page</h1>
                </section>
            </main>
        );
    }
}