"use client"

import Navbar from "@/components/layout/Navbar";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ClipboardX, Clock3, BookOpenText, Pencil } from "lucide-react";

import provinces from "@/data/provinces.json";
import districts from "@/data/districts.json";
import subDistricts from "@/data/subDistricts.json";

import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const reviewSteps = [
    { key: "info", label: "ข้อมูล" },
    { key: "companyCertificate", label: "หนังสือรับรองบริษัท" },
    { key: "citizenIdCard", label: "บัตรประชาชน" },
    { key: "faceScan", label: "แสกนใบหน้า" },
    { key: "bankBook", label: "สมุดเงินฝากธนาคาร" },
];

const documentLinks = [
    { key: "companyCertificate", label: "หนังสือรับรองบริษัท" },
    { key: "citizenIdCard", label: "บัตรประชาชน" },
    { key: "faceScan", label: "สแกนใบหน้า" },
    { key: "bankBook", label: "สมุดเงินฝากธนาคาร" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const statusConfig: Record<
    FormStatus,
    {
        label: string;
        message: string;
        badgeClass: string;
        icon: typeof Clock3;
    }
> = {
    editing: {
        label: "Editing",
        message: "กำลังแก้ไขข้อมูล",
        badgeClass: "bg-gray-200 text-gray-700",
        icon: Pencil,
    },
    pending: {
        label: "Pending",
        message: "รอเริ่มตรวจสอบ (ประมาณ 5–10 นาที)",
        badgeClass: "bg-gray-200 text-gray-700",
        icon: Clock3,
    },
    under_review: {
        label: "Under Review",
        message: "กำลังตรวจสอบเอกสาร (ประมาณ 2-3 วัน)",
        badgeClass: "bg-yellow-200 text-gray-700",
        icon: BookOpenText,
    },
    approved: {
        label: "Approved",
        message: "ได้รับการอนุมัติแล้ว สามารถดำเนินการรับเครื่อง EDC ต่อได้",
        badgeClass: "bg-green-200 text-gray-700",
        icon: CheckCircle2,
    },
    rejected: {
        label: "Rejected",
        message: "กรุณาแก้ไขเอกสาร",
        badgeClass: "bg-red-200 text-gray-700",
        icon: ClipboardX,
    },
};

function formatTel(tel: string) {
    if (tel.length === 10) {
        return `${tel.slice(0, 3)}-${tel.slice(3, 6)}-${tel.slice(6)}`;
    }

    return tel;
}

function getBusinessTypeLabel(form: FormItem) {
    if (form.businessType === "อื่นๆ" || form.businessType === "อื่น ๆ") {
        return form.otherBusinessType || form.businessType;
    }

    return form.businessType;
}

function getProvinceName(provinceId: string) {
    return (
        provinces.find((province) => province.PROVINCE_ID === Number(provinceId))
            ?.PROVINCE_NAME ?? "-"
    );
}

function getDistrictName(districtId: string) {
    return (
        districts.find((district) => district.DISTRICT_ID === Number(districtId))
            ?.DISTRICT_NAME ?? "-"
    );
}

function getSubDistrictName(subDistrictId: string) {
    return (
        subDistricts.find(
            (subDistrict) => subDistrict.SUB_DISTRICT_ID === Number(subDistrictId)
        )?.SUB_DISTRICT_NAME ?? "-"
    );
}

function getStepDotClass(status: FormStatus, index: number) { //Mockup ไว้ก่อน
    if (status === "approved") return "bg-green-400";
    if (status === "rejected") return index === 0 ? "bg-green-400" : "bg-red-400";
    if (status === "under_review") return index === 0 ? "bg-green-400" : "bg-gray-200";
    if (status === "editing") return "bg-blue-400";

    return "bg-gray-200";
}

function getFormFileUrl(formId: string, fileKey: string) {
    return `${API_BASE}/forms/${formId}/files/${fileKey}`;
}

type FormStatus = "editing" | "pending" | "under_review" | "approved" | "rejected";

type FormItem = {
    id: string;
    status: FormStatus;
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
    submittedAt: string;
    updatedAt: string;
};

export default function StatusPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [forms, setForms] = useState<FormItem[]>([]);
    const [isFormsLoading, setIsFormsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (loading || !user) return;

        async function fetchForms() {
            try {
                setIsFormsLoading(true);

                const data = await apiRequest<{ forms: FormItem[] }>("/forms");

                setForms(data.forms);
            } catch (error) {
                setError(error instanceof Error ? error.message : "โหลดสถานะไม่สำเร็จ")
            } finally {
                setIsFormsLoading(false);
            }
        }

        void fetchForms();
    }, [loading, user]);
    
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
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                            ตรวจสอบสถานะ
                        </h1>

                        <p className="mt-2 text-md font-medium text-[#0A9FE8]">
                            คำร้องขอสิทธิ์การใช้งานเครื่องรูดบัตร EDC
                        </p>
                    </div>

                    {isFormsLoading && (
                        <p className="mt-6 text-gray-600">กำลังโหลดสถานะ...</p>
                    )}

                    {error && (
                        <p className="mt-6 text-red-600">{error}</p>
                    )}

                    {!isFormsLoading && !error && forms.length === 0 && (
                        <p className="mt-6 text-gray-600">ยังไม่มีรายการสมัคร</p>
                    )}

                    {!isFormsLoading && !error && forms.length > 0 && (
                        <div className="mt-12 space-y-10">
                            {forms.map((form) => {
                                const StatusIcon = statusConfig[form.status].icon;

                                return (
                                <article
                                    key={form.id}
                                    className="overflow-hidden rounded-lg border border-gray-300 bg-white/80 shadow-sm md:grid md:grid-cols-[1fr_64px_150px]"
                                >
                                    <div className="bg-[#30313B] px-5 py-5 md:hidden">
                                    <div className="mx-auto max-w-sm space-y-6">
                                        <div className="grid grid-cols-[1fr_120px_1fr] items-start">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-5 w-5 rounded-full ${getStepDotClass(form.status, 0)}`} />
                                            <p className="mt-2 text-center text-[10px] font-semibold leading-tight text-white">
                                            {reviewSteps[0].label}
                                            </p>
                                        </div>

                                        <div className="mt-2 h-1 rounded-full bg-gray-500" />

                                        <div className="flex flex-col items-center">
                                            <div className={`h-5 w-5 rounded-full ${getStepDotClass(form.status, 1)}`} />
                                            <p className="mt-2 text-center text-[10px] font-semibold leading-tight text-white">
                                            {reviewSteps[1].label}
                                            </p>
                                        </div>
                                        </div>

                                        <div className="grid grid-cols-[1fr_72px_1fr_72px_1fr] items-start">
                                        <div className="flex flex-col items-center">
                                            <div className={`h-5 w-5 rounded-full ${getStepDotClass(form.status, 2)}`} />
                                            <p className="mt-2 text-center text-[10px] font-semibold leading-tight text-white">
                                            {reviewSteps[2].label}
                                            </p>
                                        </div>

                                        <div className="mt-2 h-1 rounded-full bg-gray-500" />

                                        <div className="flex flex-col items-center">
                                            <div className={`h-5 w-5 rounded-full ${getStepDotClass(form.status, 3)}`} />
                                            <p className="mt-2 text-center text-[10px] font-semibold leading-tight text-white">
                                            {reviewSteps[3].label}
                                            </p>
                                        </div>

                                        <div className="mt-2 h-1 rounded-full bg-gray-500" />

                                        <div className="flex flex-col items-center">
                                            <div className={`h-5 w-5 rounded-full ${getStepDotClass(form.status, 4)}`} />
                                            <p className="mt-2 text-center text-[10px] font-semibold leading-tight text-white">
                                            {reviewSteps[4].label}
                                            </p>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="relative bg-white/70 p-6">
                                        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(135deg,rgba(255,255,255,.8),rgba(226,240,248,.65))]" />

                                        <div className="relative">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                            <p className="text-sm font-semibold text-gray-900">ชื่อกิจการ</p>

                                            <h2 className="mt-1 text-2xl font-bold text-[#0A9FE8]">
                                                {form.businessName}
                                            </h2>
                                            </div>

                                            <div className="text-right">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[form.status].badgeClass}`}
                                            >
                                                <StatusIcon className="h-4 w-4" />
                                                {statusConfig[form.status].label}
                                            </span>

                                            <p className="mt-3 text-xs text-gray-500">
                                                {statusConfig[form.status].message}
                                            </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-3 text-sm text-gray-900">
                                            <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-3">
                                                <div>
                                                    <p className="font-semibold">ประเภทธุรกิจ</p>
                                                    <p>{getBusinessTypeLabel(form)}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold">เบอร์ติดต่อ</p>
                                                    <p>{formatTel(form.tel)}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold">เลขประจำตัวผู้เสียภาษี (Tax ID)</p>
                                                    <p>{form.taxId}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                                                <div>
                                                    <p className="font-semibold">ที่อยู่</p>
                                                    <p>{form.businessAddress}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold">ถนน</p>
                                                    <p>{form.road || "-"}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-4">
                                                <div>
                                                    <p className="font-semibold">จังหวัด</p>
                                                    <p>{getProvinceName(form.province)}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold">เขต/อำเภอ</p>
                                                    <p>{getDistrictName(form.district)}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold">แขวง/ตำบล</p>
                                                    <p>{getSubDistrictName(form.subDistrict)}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold">รหัสไปรษณีย์</p>
                                                    <p>{form.zipcode}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-right">
                                            <button
                                            type="button"
                                            onClick={() => setSelectedForm(form)}
                                            className="text-xl font-bold text-[#0A9FE8] underline underline-offset-2"
                                            >
                                                รายละเอียด
                                            </button>
                                        </div>
                                        </div>
                                    </div>

                                    <aside className="hidden items-center justify-center bg-[#30313B] py-5 md:flex">
                                        <div className="relative flex h-full min-h-[160px] flex-col items-center justify-between">
                                        <div className="absolute bottom-2 top-2 w-1 rounded-full bg-gray-500" />

                                        {reviewSteps.map((step, index) => (
                                            <div
                                            key={step.key}
                                            className={`relative z-10 h-5 w-5 rounded-full ${getStepDotClass(
                                                form.status,
                                                index
                                            )}`}
                                            />
                                        ))}
                                        </div>
                                    </aside>

                                    <aside className="hidden bg-[#EAF5FB] py-5 pl-4 text-sm md:block">
                                        <div className="flex h-full min-h-[160px] flex-col justify-between">
                                        {reviewSteps.map((step) => (
                                            <p key={step.key} className="text-gray-600 font-semibold">
                                                {step.label}
                                            </p>
                                        ))}
                                        </div>
                                    </aside>
                                </article>
                                );
                            })}
                        </div>
                    )}
                </section>
                <AnimatePresence>
                {selectedForm && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/40"
                            onClick={() => setSelectedForm(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        />

                        <motion.div
                            className="fixed left-1/2 top-1/2 z-60 max-h-[85vh] w-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-[#F8FBFF] p-8 shadow-xl"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    สรุปข้อมูลคำร้อง
                                </h2>

                                <h3 className="mt-4 text-md font-bold text-gray-500">
                                    ชื่อกิจการ
                                </h3>

                                <p className="mt-2 text-3xl font-bold text-[#035FC8]">
                                    {selectedForm.businessName}
                                </p>
                                </div>

                                <button
                                type="button"
                                onClick={() => setSelectedForm(null)}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                ปิด
                                </button>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    ประเภทธุรกิจ
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {getBusinessTypeLabel(selectedForm)}
                                </p>
                                </div>

                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    เบอร์ติดต่อ
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {formatTel(selectedForm.tel)}
                                </p>
                                </div>

                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    เลขประจำตัวผู้เสียภาษี (Tax ID)
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {selectedForm.taxId}
                                </p>
                                </div>

                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    รหัสไปรษณีย์
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {selectedForm.zipcode}
                                </p>
                                </div>

                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    ที่อยู่
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {selectedForm.businessAddress}
                                </p>
                                </div>

                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    ถนน
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {selectedForm.road || "-"}
                                </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    จังหวัด
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {getProvinceName(selectedForm.province)}
                                </p>
                                </div>

                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    เขต/อำเภอ
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {getDistrictName(selectedForm.district)}
                                </p>
                                </div>

                                <div>
                                <h3 className="text-md font-bold text-gray-500">
                                    แขวง/ตำบล
                                </h3>
                                <p className="mt-2 text-xl font-medium text-gray-900">
                                    {getSubDistrictName(selectedForm.subDistrict)}
                                </p>
                                </div>
                            </div>
                            <div className="mt-10">
                                <h3 className="text-lg font-bold text-gray-900">
                                    เอกสารที่ส่ง
                                </h3>

                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {documentLinks.map((document) => (
                                    <a
                                        key={document.key}
                                        href={getFormFileUrl(selectedForm.id, document.key)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-[#0A84E8] transition hover:border-blue-400 hover:bg-blue-50"
                                    >
                                        เปิด : {document.label}
                                    </a>
                                    ))}
                                </div>
                            </div>
                            </motion.div>
                    </>
                )}
                </AnimatePresence>
            </main>
        );
    }
}