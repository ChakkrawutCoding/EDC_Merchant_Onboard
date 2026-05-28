"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StepIndicator from "@/components/upload/StepIndicator";
import BusinessInfoStep from "@/components/upload/steps/BusinessInfoStep";

export default function UploadPage() {
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <main className="min-h-screen bg-[#EAF5FB]">
            <Navbar />

            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-900 md:text-6xl">
                    สมัครใช้งานเครื่องรูดบัตร{" "}
                    <span className="text-[#0A84E8]">EDC</span>
                </h1>

                <p className="mt-3 text-gray-600">
                    ง่าย ๆ ภายใน 5 ขั้นตอน
                </p>
                </div>

                <StepIndicator currentStep={currentStep} />

                <BusinessInfoStep />

                <div className="mt-10 flex justify-center gap-4">
                    <button
                        onClick={() =>
                            setCurrentStep((prev) => Math.max(prev - 1, 1))
                        }
                        className="cursor-pointer rounded-xl bg-gray-300 px-6 py-3"
                        type="submit"
                    >
                        ย้อนกลับ
                    </button>

                    <button
                        onClick={() =>
                            setCurrentStep((prev) => Math.min(prev + 1, 5))
                        }
                        className="cursor-pointer rounded-xl bg-gray-600 px-6 py-3 text-white"
                        type="submit"
                    >
                        ไปหน้าถัดไป
                    </button>
                </div>
            </section>
        </main>
    );
}