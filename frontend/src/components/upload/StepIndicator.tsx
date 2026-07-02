import { Check } from "lucide-react";

type ReviewStatus = "pending" | "approved" | "rejected";

type ReviewItem = {
    status: ReviewStatus;
    note?: string;
};

type StepReview = {
    info: ReviewItem;
    companyCertificate: ReviewItem;
    citizenIdCard: ReviewItem;
    faceScan: ReviewItem;
    bankBook: ReviewItem;
};

type StepIndicatorProps = {
    currentStep: number;
    isEditMode?: boolean;
    review?: StepReview | null;
};

export default function StepIndicator({
    currentStep,
    isEditMode = false,
    review = null,
}: StepIndicatorProps) {
    const steps = [
        { label: "กรอกข้อมูล", key: "info" },
        { label: "หนังสือรับรองบริษัท", key: "companyCertificate" },
        { label: "บัตรประชาชน", key: "citizenIdCard" },
        { label: "สแกนใบหน้า", key: "faceScan" },
        { label: "สมุดเงินฝากธนาคาร", key: "bankBook" },
    ] as const;

    const firstRow = steps.slice(0, 2);
    const secondRow = steps.slice(2);

    function getReviewStyle(status?: ReviewStatus) {
        if (!isEditMode || !status) {
            return {
                circle: "bg-slate-500 text-white",
                activeRing: "bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300",
                text: "text-gray-700 dark:text-gray-400",
                label: "",
            };
        }

        if (status === "approved") {
            return {
                circle: "bg-green-500 text-white",
                activeRing: "bg-gradient-to-r from-green-300 via-green-600 to-green-300",
                text: "text-green-600",
                label: "ไม่ต้องแก้ไข",
            };
        }

        if (status === "rejected") {
            return {
                circle: "bg-red-500 text-white",
                activeRing: "bg-gradient-to-r from-red-300 via-red-700 to-red-300",
                text: "text-red-600",
                label: "ยังไม่แก้ไข",
            };
        }

        return {
            circle: "bg-amber-400 text-white",
            activeRing: "bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200",
            text: "text-amber-500",
            label: "แก้ไขแล้ว",
        };
    }

    return (
    <>
        {/* Desktop */}
        <div className="mt-10 hidden w-full justify-center px-4 md:flex">
            <div className="flex w-full max-w-[760px] items-start">
                {steps.map((step, index) => {
                    const status = review?.[step.key]?.status; //เอา status ของ step นั้น ๆ
                    const style = getReviewStyle(status);
                    const isActive = index + 1 === currentStep;

                    return (
                        <div
                            key={step.key}
                            className="relative flex basis-1/5 flex-col items-center text-center"
                        >
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-[calc(50%+48px)] right-[calc(-50%+48px)] h-[4px] bg-gray-400 ${
                                        isEditMode ? "top-[52px]" : "top-8"
                                    }`}
                                />
                            )}

                            {isEditMode && style.label && (
                                <p className={`mb-1 text-xs font-medium ${style.text}`}>
                                    {style.label}
                                </p>
                            )}

                            <div className="relative z-10 flex h-16 items-center justify-center">
                                {isActive ? (
                                    <div className="relative flex h-16 w-16 items-center justify-center">
                                        <div className={`absolute inset-0 animate-slow-spin rounded-full ${style.activeRing}`} />
                                        <div className={`absolute inset-[5px] flex items-center justify-center rounded-full text-2xl font-bold shadow-md ${isEditMode ? style.circle : "bg-[#0A84E8] text-white"}`}>
                                            {index + 1}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold shadow-md ${style.circle}`}>
                                        {index + 1}
                                    </div>
                                )}
                            </div>

                            <p
                                className={`mt-2 w-full px-1 text-center text-sm leading-snug [overflow-wrap:anywhere] transition duration-1000 ${
                                    isActive && !isEditMode
                                        ? "font-semibold text-[#0A84E8] dark:text-[#00A0E6]"
                                        : isEditMode
                                        ? style.text
                                        : "text-gray-700 dark:text-gray-400"
                                }`}
                            >
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Mobile */}
        <div className="mt-10 space-y-8 md:hidden">
            {[firstRow, secondRow].map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className={`mx-auto flex items-start justify-center gap-x-5 px-4 ${
                        row.length === 2 ? "w-2/3" : "w-full"
                    }`}
                >
                    {row.map((step) => {
                        const realIndex = steps.indexOf(step);
                        const isActive = realIndex + 1 === currentStep;
                        const status = review?.[step.key]?.status;
                        const style = getReviewStyle(status);

                        return (
                            <div
                                key={step.key}
                                className={`relative flex min-w-0 flex-1 flex-col items-center text-center ${
                                    row.length === 2 ? "basis-1/2" : "basis-1/3"
                                }`}
                            >
                                {realIndex < steps.length - 1 &&
                                    !(rowIndex === 0 && realIndex === 1) && (
                                        <div
                                            className={`absolute left-[calc(50%+34px)] right-[calc(-50%_-_1.25rem_+_34px)] h-[3px] bg-gray-400 ${
                                                isEditMode ? "top-[38px]" : "top-5"
                                            }`}
                                        />
                                    )}
                                
                                {isEditMode && style.label && (
                                    <p className={`mb-1 text-[10px] font-medium ${style.text}`}>
                                        {style.label}
                                    </p>
                                )}
                                
                                <div className="relative z-10 flex h-12 items-center justify-center">
                                    {isActive ? (
                                        <div className="relative flex h-12 w-12 items-center justify-center">
                                            <div className={`absolute inset-0 animate-slow-spin rounded-full ${style.activeRing}`} />

                                            <div
                                                className={`absolute inset-[4px] flex items-center justify-center rounded-full text-lg font-bold shadow-md ${
                                                    isEditMode ? style.circle : "bg-[#0A84E8] text-white"
                                                }`}
                                            >
                                                {realIndex + 1}
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-bold shadow-md ${style.circle}`}
                                        >
                                            {realIndex + 1}
                                        </div>
                                    )}
                                </div>

                                <p
                                    className={`mt-2 w-full px-1 text-center text-xs leading-snug [overflow-wrap:anywhere] ${
                                        isActive && !isEditMode
                                            ? "font-semibold text-[#0A84E8]"
                                            : isEditMode
                                                ? style.text
                                                : "text-gray-700"
                                    }`}
                                >
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    </>
    );
}
