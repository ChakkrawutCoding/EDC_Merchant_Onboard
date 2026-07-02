"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  CreditCard,
  BarChart3,
  Zap,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

type benefitsItem = {
    title: string;
    description: string;
    icon: LucideIcon;
    image: string;
}

export default function Benefits() {
    const benefits : benefitsItem[] = [
        {
            title: "รับชำระเงินได้หลากหลาย",
            description: "รองรับบัตรเครดิต บัตรเดบิต และการแตะจ่าย เพิ่มความสะดวกให้ลูกค้า",
            icon: CreditCard,
            image: "/img/card-hand.png",
        },
        {
            title: "ลดการจัดการเงินสด",
            description: "ช่วยลดความผิดพลาดจากการทอนเงินและลดความเสี่ยงในการเก็บเงินสด",
            icon: BarChart3,
            image: "/img/receipt.png",
        },
        {
            title: "ให้บริการได้รวดเร็วขึ้น",
            description: "ทำรายการชำระเงินได้รวดเร็ว ลดเวลารอคิวและเพิ่มประสิทธิภาพการให้บริการ",
            icon: Zap,
            image: "/img/tap-payment.png",
        },
        {
            title: "เสริมภาพลักษณ์ธุรกิจ",
            description: "ช่วยให้ร้านค้าดูทันสมัย น่าเชื่อถือและพร้อมรองรับการชำระเงินยุคดิจิทัล",
            icon: BadgeCheck,
            image: "/img/EDC1.png",
        },
    ];

    return (
        <section className="bg-white py-20 mt-20 dark:bg-[#0F111C] transition duration-1000">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12">
                    <p className="flex text-xl font-semibold text-[#035FC8] justify-center md:justify-start text-center md:text-left dark:text-[#00A0E6] transition duration-1000">
                        ประโยชน์ที่ได้รับ
                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-gray-900 flex justify-center md:justify-start text-center md:text-left dark:text-white transition duration-1000">
                        เครื่องรูดบัตร EDC ตอบโจทย์สำหรับธุรกิจอย่างไร
                    </h2>

                    <p className="mt-4 mb-12 max-w-2xl text-gray-800 flex justify-center md:justify-start text-center md:text-left dark:text-gray-300 transition duration-1000">
                        ครบครันทุกความต้องการด้านการรับชำระเงินสำหรับร้านค้าทุกประเภท
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        {benefits.map((benefit) => (
                                <motion.div
                                    key={benefit.title}
                                    className="grid items-center gap-6 rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition hover:scale-105 hover:shadow-lg md:grid-cols-2 dark:bg-[#1C2031] dark:border-[#888A93] transition duration-1000"
                                    initial={{ opacity: 0, x: -60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeInOut",
                                    }}
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                <div>
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                        <benefit.icon className="h-7 w-7 text-[#035FC8]" />
                                    </div>

                                    <h3 className="mt-5 text-2xl font-semibold text-gray-900 dark:text-white transition duration-1000">
                                        {benefit.title}
                                    </h3>
                                    <p className="mt-3 text-gray-800 dark:text-gray-400 transition duration-1000">
                                        {benefit.description}
                                    </p>                                    
                                </div>

                                <div className="flex justify-end">
                                    <Image
                                        src={benefit.image}
                                        alt={benefit.title}
                                        width={220}
                                        height={180}
                                        className="h-[160px] w-auto object-contain"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}