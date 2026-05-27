"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "สมัครใช้งานต้องใช้เอกสารอะไรบ้าง?",
            answer: "ใช้บัตรประชาชน หนังสือรับรองบริษัท และเอกสารบัญชีธนาคาร",
        },
        {
            question: "ถ้าเอกสารไม่ผ่าน ต้องแก้ไขตรงไหนไหม?",
            answer: "ไม่ต้อง - อัปโหลดเฉพาะเอกสารที่ไม่ผ่านเท่านั้นโดยสามารถทราบเหตุผลการปฏิเสธได้ที่หน้า ตรวจสอบสถานะ หรือ หน้ากรอกข้อมูลอีกรอบ",
        },
        {
            question: "ใช้เวลาตรวจสอบนานแค่ไหน?",
            answer: "โดยทั่วไปใช้เวลา 1-3 วันทำการ",
        },
        {
            question: "ถ้าแทนใบหน้าไม่ผ่านต้องทำอย่างไร?",
            answer: "เบื้องต้นสามารถลองใหม่ได้ หากมีปัญหาสามารถติดต่อเจ้าหน้าที่เพื่อช่วยตรวจสอบและแนะนำขั้นตอนใหม่",
        },
        {
            question: "รองรับไฟล์ประเภทอะไรบ้าง?",
            answer: "ระบบรองรับการอัปโหลดไฟล์ประเภท PDF, JPG และ PNG เพื่อใช้สำหรับเอกสารประกอบการสมัคร กรุณาตรวจสอบให้ไฟล์มีความชัดเจนและขนาดไม่เกินที่ระบบกำหนด",
        },
        {
            question: "บันทึกข้อมูลไว้แล้วกลับมาทำต่อได้ไหม?",
            answer: "ได้ หากคุณเข้าสู่ระบบด้วยบัญชีเดิม ระบบจะเก็บข้อมูลการสมัครไว้ เพื่อให้สามารถกลับมาดำเนินการต่อได้ภายหลัง",
        },
        {
            question: "หากติดปัญหาระหว่างสมัครควรทำอย่างไร?",
            answer: "หากพบปัญหาระหว่างการสมัครใช้งาน สามารถติดต่อเจ้าหน้าที่ผ่านช่องทางที่ระบุในหน้านี้ ทีมงานพร้อมให้คำแนะนำและช่วยตรวจสอบปัญหาในขั้นตอนต่าง ๆ",
        },        
    ];

    const toggleFAQ = (index: number) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    return (
        <section className="py-20">
            <div className="mx-auto max-w-3xl rounded-3xl border-2 border-gray-300 bg-white p-10 shadow-md">
                <h2 className="mb-10 text-center text-4xl font-bold text-gray-900">
                คำถามที่พบบ่อย
                </h2>

                <div className="space-y-2">
                {faqs.map((faq, index) => (
                    <div
                    key={index}
                    className="border-b border-gray-300 pb-4"
                    >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="flex w-full items-center justify-between py-4 text-left"
                    >
                        <span className="text-2xl font-semibold text-[#035FC8]">
                        {faq.question}
                        </span>

                        {openIndex === index ? (
                        <ChevronUp className="h-6 w-6 text-[#035FC8]" />
                        ) : (
                        <ChevronDown className="h-6 w-6 text-[#035FC8]" />
                        )}
                    </button>

                    {openIndex === index && (
                        <p className="text-lg text-gray-800 leading-relaxed">
                        {faq.answer}
                        </p>
                    )}
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}