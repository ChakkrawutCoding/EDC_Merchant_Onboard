"use client";

import { apiRequest, apiUpload } from "@/lib/api";

import {
    clearOnboardingDraft,
    getOnboardingDraft,
    getOnboardingDraftId,
    saveOnboardingDraft,
} from "@/lib/onboarding-draft-db";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

import { AlertTriangle, Play } from "lucide-react";

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

function dataUrlToFile(dataUrl: string, filename: string, mimeType: string) {
    const [, data] = dataUrl.split(",");
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return new File([bytes], filename, { type: mimeType });
}

type UploadedDraftFile = NonNullable<FormData["companyCertificate"]>;

function appendUploadedFile(
    fd: globalThis.FormData, //FormData ตัวจริงของ browser/JavaScript runtime ไม่ใช่ FormData type
    field: ReviewFileKey,
    file: UploadedDraftFile | null
) {
    if (!file) return;

    fd.append(field, dataUrlToFile(file.base64, file.name, file.type));
}

type ReviewStatus = "pending" | "approved" | "rejected";

type ReviewFileKey =
    | "companyCertificate"
    | "citizenIdCard"
    | "faceScan"
    | "bankBook";

type ReviewItem = {
    status: ReviewStatus;
    note?: string;
};

type EditReview = {
    info: ReviewItem;
    companyCertificate: ReviewItem;
    citizenIdCard: ReviewItem;
    faceScan: ReviewItem;
    bankBook: ReviewItem;
};

type EditFormDetail = {
    id: string;
    status: string;
    businessName: string;
    businessType: string;
    otherBusinessType: string;
    taxId: string;
    tel: string;
    businessAddress: string;
    road: string;
    province: string;
    district: string;
    subDistrict: string;
    zipcode: string;
    review: EditReview;
};

function UploadPageContent() {
    const router = useRouter();

    const searchParams = useSearchParams(); //เอาไว้ดึงค่า ?

    const editFormId = searchParams.get("formId");
    const mode = searchParams.get("mode");
    const isEditMode = mode === "edit" && Boolean(editFormId);

    const { user, loading } = useAuth();
    const draftId = user ? getOnboardingDraftId(user.cognitoSub) : null;

    const [currentStep, setCurrentStep] = useState(1);
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);

    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    const [isInfoConfirmed, setIsInfoConfirmed] = useState(false);
    const [isRuleAccepted, setIsRuleAccepted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editReview, setEditReview] = useState<EditReview | null>(null);

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

    function wait(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function canEditFile(field: ReviewFileKey) {
        if (!isEditMode) return true;

        return editReview?.[field]?.status === "rejected";
    }

    function canEditInfo() {
        if (!isEditMode) return true;

        return editReview?.info?.status === "rejected";
    }

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

    const displayReview = editReview
        ? {
            ...editReview,
            companyCertificate:
                isEditMode &&
                editReview.companyCertificate.status === "rejected" &&
                formData.companyCertificate
                    ? { ...editReview.companyCertificate, status: "pending" as const }
                    : editReview.companyCertificate,
            citizenIdCard:
                isEditMode &&
                editReview.citizenIdCard.status === "rejected" &&
                formData.citizenIdCard
                    ? { ...editReview.citizenIdCard, status: "pending" as const }
                    : editReview.citizenIdCard,
            faceScan:
                isEditMode &&
                editReview.faceScan.status === "rejected" &&
                formData.faceScan
                    ? { ...editReview.faceScan, status: "pending" as const }
                    : editReview.faceScan,
            bankBook:
                isEditMode &&
                editReview.bankBook.status === "rejected" &&
                formData.bankBook
                    ? { ...editReview.bankBook, status: "pending" as const }
                    : editReview.bankBook,
            }
        : editReview;

    const currentReviewKey: keyof EditReview =
        currentStep === 1
            ? "info"
            : currentStep === 2
              ? "companyCertificate"
              : currentStep === 3
                ? "citizenIdCard"
                : currentStep === 4
                  ? "faceScan"
                  : "bankBook";

    const currentRejectedReview =
        isEditMode && editReview?.[currentReviewKey]?.status === "rejected"
            ? editReview[currentReviewKey]
            : null;

    const currentRejectedNote =
        currentRejectedReview?.note?.trim() ||
        "กรุณาตรวจสอบและแก้ไขข้อมูลหรือเอกสารนี้ แล้วส่งกลับมาใหม่อีกครั้ง";

    useEffect(() => {
        if (loading || !user || !isEditMode || !editFormId) return;

        async function loadEditForm() {
            try {
                const data = await apiRequest<{ form: EditFormDetail }>(
                    `/forms/${editFormId}`
                );

                setFormData((prev) => ({
                    ...prev,
                    businessName: data.form.businessName,
                    businessType: data.form.businessType,
                    otherBusinessType: data.form.otherBusinessType,
                    taxId: data.form.taxId,
                    tel: data.form.tel,
                    businessAddress: data.form.businessAddress,
                    road: data.form.road,
                    province: data.form.province,
                    district: data.form.district,
                    subDistrict: data.form.subDistrict,
                    zipcode: data.form.zipcode,
                }));

                setEditReview(data.form.review);

                setCurrentStep(1);
                setIsDraftLoaded(true);
            } catch (error) {
                showAlert(
                    error instanceof Error
                        ? error.message
                        : "โหลดข้อมูลสำหรับแก้ไขไม่สำเร็จ",
                    "danger"
                );

                router.replace("/status");
            }
        }

        void loadEditForm();
    }, [loading, user, isEditMode, editFormId, router]);

    useEffect(() => {
        if (loading || !user || isEditMode) return;

        async function loadDraft() {
            if (!draftId) return;

            const draft = await getOnboardingDraft(draftId);

            if (draft) {
                setFormData((prev) => ({
                    ...prev,
                    ...draft.formData,
            }));

            setCurrentStep(draft.currentStep);
            }

            setIsDraftLoaded(true);
        }

        void loadDraft();
    }, [loading, user, isEditMode]);

    const saveDraft = useCallback(
        async (step = currentStep, data = formData) => {
            try {
                if (!draftId) return;

                await saveOnboardingDraft(draftId, {
                    currentStep: step,
                    formData: data,
                    savedAt: new Date().toISOString(),
                });
            } catch (error) {
                console.error("Save draft failed:", error);
                showAlert(
                    "ไม่สามารถบันทึกข้อมูลชั่วคราวได้ อาจเป็นเพราะไฟล์มีขนาดใหญ่เกินไป",
                    "warning"
                );
            }
        },
        [currentStep, formData, draftId]
    );

    useEffect(() => {
        if (!user || !isDraftLoaded || isEditMode) return;
        
        void saveDraft();
    }, [user, isDraftLoaded, isEditMode, saveDraft]);

    const showSaveToast = () => {
        showAlert("Auto Saved Complete การบันทึกอัตโนมัติสำเร็จ", "success");
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

        if (currentStep === 1 && !isBusinessInfoValid()) {
            showAlert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง", "warning");
            return;
        }

        if (
            currentStep === 4 &&
            (!isEditMode || isRejectedFile("faceScan")) &&
            !formData.faceVerification?.matched
        ) {
            showAlert("กรุณาสแกนใบหน้าให้ผ่านก่อนดำเนินการต่อ", "warning");
            return;
        }

        if (currentStep === 5) {
            if ((!isEditMode || isRejectedFile("bankBook")) && !formData.bankBook) {
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
    

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    function isRejectedFile(field: ReviewFileKey) {
        return isEditMode && editReview?.[field]?.status === "rejected";
    }

    const isFaceStepBlocked =
        currentStep === 4 &&
        (!isEditMode || isRejectedFile("faceScan")) &&
        !formData.faceVerification?.matched;

    const isNextButtonDisabled = isFaceStepBlocked;

    async function submitApplication() {
        if (isSubmitting) return;

        if (!isEditMode) {
            if (
                !formData.companyCertificate ||
                !formData.citizenIdCard ||
                !formData.bankBook ||
                !formData.faceScan
            ) {
                showAlert("กรุณาอัปโหลดเอกสารให้ครบถ้วน", "warning");
                return;
            }
        } else {
            const missingRejectedFiles =
                (isRejectedFile("companyCertificate") && !formData.companyCertificate) || //ถ้า...ไม่ผ่าน และ user ยังไม่ได้อัปโหลดใหม่
                (isRejectedFile("citizenIdCard") && !formData.citizenIdCard) ||
                (isRejectedFile("faceScan") && !formData.faceScan) ||
                (isRejectedFile("bankBook") && !formData.bankBook);

            if (missingRejectedFiles) {
                showAlert("กรุณาอัปโหลดเอกสารที่ไม่ผ่านการตรวจสอบให้ครบถ้วน", "warning");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const fd = new FormData();

            fd.append("businessName", formData.businessName);
            fd.append("businessType", formData.businessType);
            fd.append("otherBusinessType", formData.otherBusinessType);
            fd.append("taxId", formData.taxId);
            fd.append("tel", formData.tel);
            fd.append("businessAddress", formData.businessAddress);
            fd.append("road", formData.road);
            fd.append("province", formData.province);
            fd.append("district", formData.district);
            fd.append("subDistrict", formData.subDistrict);
            fd.append("zipcode", formData.zipcode);

            fd.append(
                "faceVerification",
                JSON.stringify(formData.faceVerification ?? { matched: false, score: 0 })
            );

            appendUploadedFile(fd, "companyCertificate", formData.companyCertificate);
            appendUploadedFile(fd, "citizenIdCard", formData.citizenIdCard);
            appendUploadedFile(fd, "faceScan", formData.faceScan);
            appendUploadedFile(fd, "bankBook", formData.bankBook);

            if (isEditMode && editFormId) {
                await apiUpload(`/forms/${editFormId}/resubmit`, fd, {
                    method: "PATCH",
                });
            } else {
                await apiUpload("/forms", fd);
            }

            if (!isEditMode) {
                if (draftId) {
                    await clearOnboardingDraft(draftId);
                }
            }

            showAlert("ส่งเอกสารเรียบร้อย", "success");

            await wait(1000);
            router.push("/status");
        } catch (error) {
            showAlert(error instanceof Error ? error.message : "ส่งเอกสารไม่สำเร็จ", "danger");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading || !user) {
        return (
            <main className="min-h-screen bg-[#EAF5FB] dark:bg-[#0F111C] transition duration-1000">
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
        <main className="min-h-screen bg-[#EAF5FB] dark:bg-[#0F111C] transition duration-1000">
            <Navbar />


            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="text-center">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 transition duration-1000 dark:text-white">
                    {isEditMode ? "แก้ไขข้อมูลการสมัคร" : "สมัครใช้งานเครื่องรูดบัตร"}{" "}
                    <span className="text-[#0A84E8] dark:text-[#00A0E6]
                        transition duration-1000">EDC</span>
                </h1>

                <p className="mt-3 text-gray-600 transition duration-1000 dark:text-gray-400">
                    {isEditMode
                        ? "กรุณาแก้ไขข้อมูลหรือเอกสารที่ไม่ผ่านการตรวจสอบ"
                        : "ง่าย ๆ ภายใน 5 ขั้นตอน"}
                </p>
                </div>

                <StepIndicator
                    currentStep={currentStep}
                    isEditMode={isEditMode}
                    review={displayReview}
                />

                {currentRejectedReview && (
                    <div className="mx-auto mt-6 flex w-full max-w-[900px] items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                        <div>
                            <p className="font-semibold">
                                เอกสารเดิมไม่ผ่านการตรวจสอบ
                            </p>
                            <p className="mt-1">{currentRejectedNote}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleNextStep}>
                    {currentStep === 1 && (
                        <BusinessInfoStep
                            formData={formData}
                            setFormData={setFormData}
                            disabled={!canEditInfo()}
                        />
                    )}

                    {currentStep === 2 && (
                        <CompanyDocumentStep
                            formData={formData}
                            setFormData={setFormData}
                            disabled={!canEditFile("companyCertificate")}
                        />
                    )}

                    {currentStep === 3 && (
                        <CitizenIdCardStep
                            formData={formData}
                            setFormData={setFormData}
                            disabled={!canEditFile("citizenIdCard")}
                        />
                    )}

                    {currentStep === 4 && (
                        <FaceScanStep
                            formData={formData}
                            setFormData={setFormData}
                            disabled={!canEditFile("faceScan")}
                            showAlert={showAlert}
                        />
                    )}

                    {currentStep === 5 && (
                        <BankBookStep
                            formData={formData}
                            setFormData={setFormData}
                            disabled={!canEditFile("bankBook")}
                        />
                    )}

                    <div className="mt-10 flex justify-center gap-4">
                        <button
                            onClick={() => {
                                const previousStep = Math.max(currentStep - 1, 1);

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
                            disabled={isNextButtonDisabled}
                            className={`rounded-xl px-6 py-3 ${
                                isNextButtonDisabled
                                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                    : "cursor-pointer bg-gray-600 text-white hover:bg-gray-700"
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
                                                disabled={!canSubmitSummary || isSubmitting}
                                                onClick={submitApplication}
                                                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-white transition ${
                                                    canSubmitSummary && !isSubmitting
                                                        ? "cursor-pointer bg-blue-600 hover:bg-blue-700"
                                                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                                                }`}
                                            >
                                                <Play className="h-4 w-4 fill-current" />
                                                {isSubmitting
                                                    ? isEditMode
                                                        ? "กำลังส่งข้อมูลแก้ไข..."
                                                        : "กำลังส่งเอกสาร..."
                                                    : isEditMode
                                                        ? "ยืนยันการส่งข้อมูลแก้ไข"
                                                        : "ยืนยันการส่งเอกสาร"}
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
}

export default function UploadPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#EAF5FB] dark:bg-[#0F111C] transition duration-1000">
                    <Navbar />
                    <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
                        <p className="text-center text-gray-600 dark:text-gray-300">
                            กำลังโหลดหน้าอัปโหลด...
                        </p>
                    </section>
                </main>
            }
        >
            <UploadPageContent />
        </Suspense>
    );
}
