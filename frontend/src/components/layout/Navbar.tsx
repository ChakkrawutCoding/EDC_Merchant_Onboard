"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Left Side */}
                <div className="flex items-center">
                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                        type="button"
                    >
                        <>
                            {!isMenuOpen && (
                                <Menu className="h-8 w-8 text-gray-700" />
                            )}
                        </>
                    </button>
                    {/* Logo */}
                    <div className="hidden md:block">
                        <Image
                            src="/logo/digio-logo.svg"
                            alt="Digio Logo"
                            width={120}
                            height={40}
                            className="h-auto w-auto"
                        />
                    </div>
                </div>
                
                {/* Middle Side */}
                <nav className="hidden gap-8 md:flex">
                    <Link href="/" className="text-sm text-gray-700 hover:text-blue-600 hover:scale-105 transition">
                        EDC คืออะไร
                    </Link>

                    <Link href="/upload" className="text-sm text-gray-700 hover:text-blue-600 hover:scale-105 transition">
                        อัพโหลดเอกสาร
                    </Link>

                    <Link href="/status" className="text-sm text-gray-700 hover:text-blue-600 hover:scale-105 transition">
                        ตรวจสอบสถานะ
                    </Link>

                    <Link href="/contact" className="text-sm text-gray-700 hover:text-blue-600 hover:scale-105 transition">
                        ติดต่อเจ้าหน้าที่
                    </Link>
                </nav>
                
                {/* Right Side */}
                <Link
                    href="/login"
                    className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 hover:scale-105 transition"
                >
                    เข้าสู่ระบบ
                </Link>
            </div>
            
            {/* Mobile Side Bar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/40 md:hidden"
                            onClick={() => setIsMenuOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        />

                        {/* Sidebar */}
                        <motion.div
                            className="fixed left-0 top-0 z-50 h-screen w-72 bg-[#1D5594] p-6 shadow-2xl md:hidden"
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{
                                duration: 0.35,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="mb-10 flex items-center justify-between">
                                <Image
                                    src="/logo/digio-white-logo.svg"
                                    alt="Digio Logo"
                                    width={110}
                                    height={36}
                                    className="h-auto w-auto"
                                />

                                <button onClick={() => setIsMenuOpen(false)} type="button">
                                    <X className="h-8 w-8 text-white" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-8">
                                <Link
                                    href="/"
                                    className="text-2xl font-medium text-white hover:text-blue-600 hover:scale-105 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    EDC คืออะไร
                                </Link>

                                <Link
                                    href="/upload"
                                    className="text-2xl font-medium text-white hover:text-blue-600 hover:scale-105 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    อัพโหลดเอกสาร
                                </Link>

                                <Link
                                    href="/status"
                                    className="text-2xl font-medium text-white hover:text-blue-600 hover:scale-105 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ตรวจสอบสถานะ
                                </Link>

                                <Link
                                    href="/contact"
                                    className="text-2xl font-medium text-white hover:text-blue-600 hover:scale-105 transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ติดต่อเจ้าหน้าที่
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}