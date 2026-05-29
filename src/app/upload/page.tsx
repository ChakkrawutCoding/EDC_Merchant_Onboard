"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import StepIndicator from "@/components/upload/StepIndicator";
import BusinessInfoStep from "@/components/upload/steps/BusinessInfoStep";
import CompanyDocumentStep from "@/components/upload/steps/CompanyDocumentStep";

import type { FormData } from "@/types/form";

export default function UploadPage() {
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState<FormData>({
        businessName: "",
        businessType: "",
        otherBusinessType: "",
        taxId: "",
        tel: "",
        businessAddress: "",
        road: "",
        province: "",
        district: "",
        subDistrict: "",
        zipcode: "",

        companyCertificate: null,
    });

    useEffect(() => {
        const draft = localStorage.getItem("edcOnboardingDraft");

        if (!draft) return;

        const parsed = JSON.parse(draft);

        setFormData(parsed.formData);
        setCurrentStep(parsed.currentStep);
    }, []);

    const saveDraft = (step: number) => {
        localStorage.setItem(
            "edcOnboardingDraft",
            JSON.stringify({
                currentStep: step,
                formData,
                savedAt: new Date().toISOString(),
            })
        );
    };

    const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nextStep = Math.min(currentStep + 1, 5);

        saveDraft(nextStep);
        setCurrentStep(nextStep);
    };

    return (
        <main className="min-h-screen bg-[#EAF5FB]">
            <Navbar />

            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="text-center">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                    สมัครใช้งานเครื่องรูดบัตร{" "}
                    <span className="text-[#0A84E8]">EDC</span>
                </h1>

                <p className="mt-3 text-gray-600">
                    ง่าย ๆ ภายใน 5 ขั้นตอน
                </p>
                </div>

                <StepIndicator currentStep={currentStep} />

                <form onSubmit={handleNextStep}>
                    {currentStep === 1 && (
                        <BusinessInfoStep
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}

                    {currentStep === 2 && (
                        <CompanyDocumentStep
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}

                    <div className="mt-10 flex justify-center gap-4">
                        <button
                            onClick={() => {
                                const previousStep = Math.max(currentStep - 1, 1);

                                saveDraft(previousStep);
                                setCurrentStep(previousStep);
                            }}
                            disabled={currentStep === 1}
                            
                            className={`rounded-xl px-6 py-3 transition ${
                                currentStep === 1
                                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                    : "cursor-pointer bg-gray-600 text-white hover:bg-gray-700"
                            }`}
                            type="button"
                        >
                            ย้อนกลับ
                        </button>

                        <button
                            className="cursor-pointer rounded-xl bg-gray-600 px-6 py-3 text-white"
                            type="submit"
                        >
                            ไปหน้าถัดไป
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}