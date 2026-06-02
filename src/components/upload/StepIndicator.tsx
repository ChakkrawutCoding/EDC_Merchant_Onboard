import { Check } from "lucide-react";

type StepIndicatorProps = {
    currentStep: number;
};

export default function StepIndicator({currentStep} : StepIndicatorProps) {
    const steps = [
        "กรอกข้อมูล",
        "หนังสือรับรองบริษัท",
        "บัตรประชาชน",
        "สแกนใบหน้า",
        "สมุดเงินฝากธนาคาร",
    ];

    const firstRow = steps.slice(0, 2);
    const secondRow = steps.slice(2);

    return (
    <>
        {/* Desktop */}
        <div className="mt-10 hidden w-full justify-center px-4 md:flex">
            <div className="flex w-full max-w-[760px] items-start">
                {steps.map((step, index) => (
                    <div
                        key={step}
                        className="relative flex basis-1/5 flex-col items-center text-center"
                    >
                        {index < steps.length - 1 && (
                            <div className="absolute left-[calc(50%+48px)] right-[calc(-50%+48px)] top-8 h-[4px] bg-gray-400" />
                        )}

                        <div className="relative z-10 flex h-16 items-center justify-center">
                            {index + 1 === currentStep ? (
                                <div className="relative flex h-16 w-16 items-center justify-center">
                                    <div className="absolute inset-0 animate-slow-spin rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300" />
                                    <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-[#0A84E8] text-2xl font-bold text-white shadow-md">
                                        {index + 1}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-500 text-2xl font-bold text-white shadow-md">
                                    {index + 1}
                                </div>
                            )}
                        </div>

                        <p
                            className={`mt-2 w-full px-1 text-center text-sm leading-snug [overflow-wrap:anywhere] ${
                                index + 1 === currentStep
                                    ? "font-semibold text-[#0A84E8]"
                                    : "text-gray-700"
                            }`}
                        >
                            {step}
                        </p>
                    </div>
                ))}
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

                        return (
                            <div
                                key={step}
                                className={`relative flex min-w-0 flex-1 flex-col items-center text-center ${
                                    row.length === 2 ? "basis-1/2" : "basis-1/3"
                                }`}
                            >
                                {realIndex < steps.length - 1 &&
                                    !(rowIndex === 0 && realIndex === 1) && (
                                        <div className="absolute left-[calc(50%+34px)] right-[calc(-50%_-_1.25rem_+_34px)] top-5 h-[3px] bg-gray-400" />
                                    )}

                                <div className="relative z-10 flex h-12 items-center justify-center">
                                    {isActive ? (
                                        <div className="relative flex h-12 w-12 items-center justify-center">
                                            <div className="absolute inset-0 animate-slow-spin rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300" />

                                            <div className="absolute inset-[4px] flex items-center justify-center rounded-full bg-[#0A84E8] text-lg font-bold text-white shadow-md">
                                                {realIndex + 1}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-500 text-base font-bold text-white shadow-md">
                                            {realIndex + 1}
                                        </div>
                                    )}
                                </div>

                                <p
                                    className={`mt-2 w-full px-1 text-center text-xs leading-snug [overflow-wrap:anywhere] ${
                                        isActive
                                            ? "font-semibold text-[#0A84E8]"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {step}
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
