"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Check, Play } from "lucide-react";

import AppAlert from "@/components/ui/AppAlert";

import Navbar from "@/components/layout/Navbar";
import StepIndicator from "@/components/upload/StepIndicator";
import BusinessInfoStep from "@/components/upload/steps/BusinessInfoStep";
import CompanyDocumentStep from "@/components/upload/steps/CompanyDocumentStep";
import CitizenIdCardStep from "@/components/upload/steps/CitizenIdCardStep";
import FaceScanStep from "@/components/upload/steps/FaceScanStep";
import BankBookStep from "@/components/upload/steps/BankBookStep";

import provinces from "@/data/provinces.json";
import districts from "@/data/districts.json";
import subDistricts from "@/data/subDistricts.json";

import type { FormData } from "@/types/form";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);

    const [isSaveToastOpen, setIsSaveToastOpen] = useState(false);

    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    const [isInfoConfirmed, setIsInfoConfirmed] = useState(false);
    const [isRuleAccepted, setIsRuleAccepted] = useState(false);

    const [appAlert, setAppAlert] = useState<{
        message: string;
        variant: "default" | "success" | "danger" | "warning";
    } | null>(null);

    const showAlert = (
        message: string,
        variant: "default" | "success" | "danger" | "warning" = "default"
    ) => {
        setAppAlert({ message, variant });

        setTimeout(() => {
            setAppAlert(null);
        }, 3000);
    };

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
        faceScan: null,
        faceVerification: null,
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

    const saveDraft = useCallback(
        (step = currentStep, data = formData) => {
            try {
                localStorage.setItem(
                    "edcOnboardingDraft",
                    JSON.stringify({
                        currentStep: step,
                        formData: data,
                        savedAt: new Date().toISOString(),
                    })
                );
            } catch (error) {
                console.error("Save draft failed:", error);
                showAlert("ไม่สามารถบันทึกข้อมูลชั่วคราวได้ อาจเป็นเพราะไฟล์มีขนาดใหญ่เกินไป", "warning");
            }
        },
        [currentStep, formData]
    );

    useEffect(() => {
        if (!isDraftLoaded) return;
        
        saveDraft();
    }, [isDraftLoaded, saveDraft]);

    const showSaveToast = () => {
        setIsSaveToastOpen(true);

        setTimeout(() => {
            setIsSaveToastOpen(false);
        }, 2000);
    };

    const isBusinessInfoValid = () => {
        const isOtherBusinessTypeRequired = formData.businessType === "อื่น ๆ";

        return (
            formData.businessName.trim() !== "" && //ชื่อกิจการไม่ว่าง
            formData.businessType.trim() !== "" && //เลือกประเภทธุรกิจแล้ว
            (!isOtherBusinessTypeRequired || formData.otherBusinessType.trim() !== "") &&
            //ถ้าไม่ได้เลือก อื่น ๆ ผ่านเลย แต่ถ้าเลือกต้องกรอกช่อง otherBusinessType แล้ว
            formData.taxId.length === 13 && //Tax ID 13 หลักพอดี
            formData.tel.length >= 9 && formData.tel.length <= 10 &&
            //เบอร์โทร 9-10 หลัก
            formData.businessAddress.trim() !== "" && //ที่อยู่กิจการไม่ว่าง
            formData.province.trim() !== "" && //เลือก จังหวัด แล้ว
            formData.district.trim() !== "" && //เลือก เขต/อำเภอ แล้ว
            formData.subDistrict.trim() !== "" && //เลือก แขวง/ตำบล แล้ว
            formData.zipcode.length === 5 //รหัสไปรษณีย์ มี 5 หลักพอดี
        );
    };

    const handleNextStep = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSaveToastOpen) return;

        if (currentStep === 1 && !isBusinessInfoValid()) {
            showAlert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง", "warning");
            return;
        }

        if (currentStep === 4 && !formData.faceVerification?.matched) {
            showAlert("กรุณาสแกนใบหน้าให้ผ่านก่อนดำเนินการต่อ", "warning");
            return;
        }

        if (currentStep === 5) {
            if (!formData.bankBook) {
                showAlert("กรุณาอัปโหลดสมุดบัญชีก่อนยืนยันการส่ง", "warning");
                return;
            }

            setIsSummaryOpen(true);
            return;
        }

        const nextStep = Math.min(currentStep + 1, 5);

        setCurrentStep(nextStep);
        showSaveToast();
    };

    const selectedProvince = provinces.find(
        (province) => province.PROVINCE_ID === Number(formData.province)
    );

    const selectedDistrict = districts.find(
        (district) => district.DISTRICT_ID === Number(formData.district)
    );

    const selectedSubDistrict = subDistricts.find(
        (subDistrict) => subDistrict.SUB_DISTRICT_ID === Number(formData.subDistrict)
    );

    const canSubmitSummary = isInfoConfirmed && isRuleAccepted;
    const router = useRouter();

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

                    {currentStep === 4 && (
                        <FaceScanStep
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
                                if (isSaveToastOpen) return;

                                const previousStep = Math.max(currentStep - 1, 1);

                                setCurrentStep(previousStep);
                                showSaveToast();
                            }}
                            disabled={currentStep === 1 || isSaveToastOpen}
                            
                            className={`rounded-xl px-6 py-3 transition ${
                                currentStep === 1 || isSaveToastOpen
                                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                    : "cursor-pointer bg-gray-600 text-white hover:bg-gray-700"
                            }`}
                            type="button"
                        >
                            ย้อนกลับ
                        </button>

                        <button
                            disabled={isSaveToastOpen || (currentStep === 4 && !formData.faceVerification?.matched)}
                            className={`rounded-xl px-6 py-3 ${
                                isSaveToastOpen || (currentStep === 4 && !formData.faceVerification?.matched)
                                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                    : "cursor-pointer bg-gray-600 text-white"
                            }`}
                            type="submit"
                        >
                            {currentStep === 5 ? "ยืนยันการส่ง" : "ไปหน้าถัดไป"}
                        </button>
                    </div>
                    <AnimatePresence>
                        {isSummaryOpen && (
                            
                                <>
                                    {/* Backdrop */}
                                    <motion.div
                                        className="fixed inset-0 z-60 bg-black/40"
                                        onClick={() => setIsSummaryOpen(false)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    />

                                    {/* Popup Box */}
                                    <motion.div
                                        className="fixed left-1/2 top-1/2 z-70 max-h-[85vh] w-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#F8FBFF] p-8 shadow-xl"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setIsSummaryOpen(false)}
                                            className="absolute right-6 top-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 hover:scale-105 transition"
                                        >
                                            ย้อนกลับ
                                        </button>

                                        <h2 className="text-xl font-bold text-gray-900">
                                            - สรุปข้อมูลก่อนยืนยันการส่ง -
                                        </h2>

                                        <h3 className="mt-4 text-md font-bold text-gray-500">
                                            ชื่อกิจการ
                                        </h3>

                                        <h2 className="mt-2 text-3xl font-bold text-[#035FC8]">
                                            {formData.businessName}
                                        </h2>

                                        <h3 className="mt-4 text-md font-bold text-gray-500">
                                            ประเภทธุรกิจ
                                        </h3>

                                        <p className="mt-2 text-xl font-medium text-gray-900">
                                            {formData.businessType === "อื่น ๆ" ? formData.otherBusinessType : formData.businessType}
                                        </p>

                                        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    เบอร์โทรติดต่อ
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {formData.tel.slice(0,3)} - {formData.tel.slice(3,6)} - {formData.tel.slice(6,10)}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    เลขประจำตัวผู้เสียภาษี (Tax ID)
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {formData.taxId}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    ที่อยู่กิจการ
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {formData.businessAddress}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    ถนน
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {formData.road}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4">
                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    จังหวัด
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {selectedProvince?.PROVINCE_NAME ?? "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    เขต/อำเภอ
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {selectedDistrict?.DISTRICT_NAME ?? "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    แขวง/ตำบล
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {selectedSubDistrict?.SUB_DISTRICT_NAME ?? "-"}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-md font-bold text-gray-500">
                                                    รหัสไปรษณีย์
                                                </h3>

                                                <p className="mt-2 text-xl font-medium text-gray-900">
                                                    {formData.zipcode}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-20 space-y-8">
                                            {formData.companyCertificate?.type === "application/pdf" ? (
                                                <iframe
                                                    src={formData.companyCertificate.base64}
                                                    className="mx-auto h-[700px] mt-4 w-full max-w-2xl"
                                                />
                                            ) : (
                                                <img
                                                    src={formData.companyCertificate?.base64}
                                                    alt="Company document"
                                                    className="mx-auto max-h-[600px] mt-4 w-full max-w-2xl object-contain"
                                                />
                                            )}

                                            {formData.citizenIdCard?.type === "application/pdf" ? (
                                                <iframe
                                                    src={formData.citizenIdCard.base64}
                                                    className="mx-auto h-[700px] mt-4 w-full max-w-2xl"
                                                />
                                            ) : (
                                                <img
                                                    src={formData.citizenIdCard?.base64}
                                                    alt="Company document"
                                                    className="mx-auto max-h-[600px] mt-4 w-full max-w-2xl object-contain"
                                                />
                                            )}
                                            
                                            {formData.bankBook?.type === "application/pdf" ? (
                                                <iframe
                                                    src={formData.bankBook.base64}
                                                    className="mx-auto h-[700px] mt-4 w-full max-w-2xl"
                                                />
                                            ) : (
                                                <img
                                                    src={formData.bankBook?.base64}
                                                    alt="Company document"
                                                    className="mx-auto max-h-[600px] mt-4 w-full max-w-2xl object-contain"
                                                />
                                            )}
                                        </div>

                                        <div className="mt-8 space-y-3">
                                            <label className="flex items-start gap-4 text-sm text-gray-900 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isInfoConfirmed}
                                                    onChange={(e) => setIsInfoConfirmed(e.target.checked)}
                                                    className="h-4 w-4 accent-[#37D741]"
                                                />
                                                <span>ข้าพเจ้าได้ตรวจสอบว่าข้อมูลถูกต้องเรียบร้อย</span>
                                            </label>

                                            <label className="flex items-start gap-4 text-sm text-gray-900 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isRuleAccepted}
                                                    onChange={(e) => setIsRuleAccepted(e.target.checked)}
                                                    className="h-4 w-4 accent-[#37D741]"
                                                />
                                                <span>
                                                    ข้าพเจ้าได้ทำตาม
                                                    <a
                                                        href="/docs/rules.pdf"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-medium text-[#0A84E8] hover:underline"
                                                    >
                                                        กฎและข้อระเบียบ
                                                    </a>
                                                    ที่ว่าไว้ใน XXxxxx
                                                </span>
                                            </label>
                                        </div>
                                        
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                type="button"
                                                disabled={!canSubmitSummary}
                                                onClick={() => {
                                                    showAlert("ส่งเอกสารเรียบร้อย", "success");
                                                    setTimeout(() => {
                                                        router.push("/status");
                                                    }, 1000);
                                                }}
                                                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-white transition ${
                                                    canSubmitSummary
                                                        ? "cursor-pointer bg-blue-600 hover:bg-blue-700"
                                                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                                                }`}
                                            >
                                                <Play className="h-4 w-4 fill-current" />
                                                ยืนยันการส่งเอกสาร
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                        )}
                    </AnimatePresence>
                </form>
            </section>
            <AnimatePresence>
                {appAlert && (
                    <AppAlert
                        message={appAlert.message}
                        variant={appAlert.variant}
                        onClose={() => setAppAlert(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
