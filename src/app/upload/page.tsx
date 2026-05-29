"use client";

import { useEffect, useState } from "react";

import { Check } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import StepIndicator from "@/components/upload/StepIndicator";
import BusinessInfoStep from "@/components/upload/steps/BusinessInfoStep";
import CompanyDocumentStep from "@/components/upload/steps/CompanyDocumentStep";
import CitizenIdCardStep from "@/components/upload/steps/CitizenIdCardStep";
import BankBookStep from "@/components/upload/steps/BankBookStep";

import type { FormData } from "@/types/form";

export default function UploadPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);

    const [isSaveToastOpen, setIsSaveToastOpen] = useState(false);

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
        citizenIdCard: null,
        bankBook: null,
    });

    useEffect(() => {
        const draft = localStorage.getItem("edcOnboardingDraft");

        if (draft) {
            const parsed = JSON.parse(draft);

            setFormData((prev) => ({
                ...prev,
                ...parsed.formData,
            }));
            setCurrentStep(parsed.currentStep);
        }

        setIsDraftLoaded(true);
    }, []);

    useEffect(() => {
        if (!isDraftLoaded) return;

        localStorage.setItem(
            "edcOnboardingDraft",
            JSON.stringify({
                currentStep,
                formData,
                savedAt: new Date().toISOString(),
            })
        );
    }, [currentStep, formData, isDraftLoaded]);

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

    const showSaveToast = () => {
        setIsSaveToastOpen(true);

        setTimeout(() => {
            setIsSaveToastOpen(false);
        }, 2000);
    };

    const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nextStep = Math.min(currentStep + 1, 5);

        saveDraft(nextStep);
        setCurrentStep(nextStep);
        showSaveToast();
    };

    return (
        <main className="min-h-screen bg-[#EAF5FB]">
            <Navbar />

            <div
                className={`fixed left-1/2 top-20 z-[1000] w-[min(90vw,720px)] -translate-x-1/2 rounded-md border-2 border-green-500 bg-green-100 px-4 py-2 text-sm font-medium text-green-600 shadow-lg transition-all duration-500 ease-out ${
                    isSaveToastOpen
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-12 opacity-0"
                }`}
            >
                <div className="flex items-center justify-center gap-3">
                    <Check className="h-5 w-5 shrink-0 stroke-[3]" />
                    <span>Auto Saved Complete การบันทึกอัตโนมัติสำเร็จ</span>
                </div>
            </div>

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

                    {currentStep === 3 && (
                        <CitizenIdCardStep
                            formData={formData}
                            setFormData={setFormData}
                        />
                    )}

                    {currentStep === 5 && (
                        <BankBookStep
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
                                showSaveToast();
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