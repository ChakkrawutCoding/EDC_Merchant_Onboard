"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import TypewriterComponent from "typewriter-effect";

const messages = [
    "รองรับบัตร, QR และ e-wallet ในเครื่องเดียว",
    "ชำระเงินได้ครบ จบในเครื่องเดียว",
    "รับเงินได้ทุกช่องทาง ไม่พลาดทุกการขาย",
    "แตะ สแกน จ่าย ครบในเครื่องเดียว",
    "จ่ายสะดวก ไม่ว่าจะบัตร QR หรือ e-Wallet",
];

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white dark:from-[#0F111C] dark:to-[#0F111C] transition duration-1000">
            <div className="absolute left-1/2 top-0 h-[550px] w-[1250px] -translate-x-1/2 rounded-b-[999px]
            bg-gradient-to-b from-[#C2E8F8] to-[#71B2E8] dark:from-[#0F111C] dark:to-[#132E4E] transition duration-1000" />
            <div className="absolute left-[-120px] top-20 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl dark:opacity-25 transition duration-1000" />
            <div className="absolute right-[-120px] top-20 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl dark:opacity-25 transition duration-1000" />
            <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
                <div className="grid items-center gap-8 md:grid-cols-3">

                    <div className="flex justify-center">
                        <motion.div
                            className="flex items-center justify-center rounded-2xl"
                            animate={{ y: [0, -25, 0] }}
                            transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            }}
                        >
                            <Image
                            src="/img/EDC1.png"
                            alt="EDC Terminal"
                            width={380}
                            height={700}
                            className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>

                    <div className="text-center">
                        <p className="inline-flex items-center rounded-full border border-white/60 bg-white/80 text-[#121212] px-5 py-2 text-sm font-medium shadow-lg backdrop-blur transition duration-1000 hover:scale-105 dark:bg-[#333540] dark:text-white">
                        เครื่องรูดบัตร EDC
                        </p>

                        <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl text-[#121212] dark:text-white transition duration-1000">
                        <span className="text-[#035FC8] dark:text-[#00A0E6] transition duration-1000">ทุกการจ่าย</span>
                        <br />
                        ง่ายในเครื่องเดียว
                        </h1>

                        <div className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-gray-900 dark:text-white transition duration-1000">
                            <TypewriterComponent
                                onInit={(typewriter) => {
                                    messages.forEach((message) => {
                                    typewriter
                                        .typeString(message)
                                        .pauseFor(2000)
                                        .deleteAll();
                                    });

                                    typewriter.start();
                                }}
                                options={{
                                    loop: true,
                                    delay: 30,
                                    cursor: "|",
                                }}
                            />         
                        </div>
                        
                        <Link href="/upload">
                            <button className="cursor-pointer mt-8 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl transition duration-1000 hover:scale-105 hover:bg-blue-700">
                            กรอกแบบฟอร์มขอใช้เครื่อง EDC
                            </button>
                        </Link>
                    </div>

                    <div className="flex justify-center">
                        <motion.div
                            className="flex items-center justify-center rounded-2xl"
                            animate={{ y: [0, 25, 0] }}
                            transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            }}
                        >
                            <Image
                            src="/img/EDC2.png"
                            alt="EDC Terminal"
                            width={380}
                            height={700}
                            className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}