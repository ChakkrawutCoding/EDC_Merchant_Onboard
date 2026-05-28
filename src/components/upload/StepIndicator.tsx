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
        <div className="mt-10 hidden items-start justify-center px-4 md:flex">
            {steps.map((step, index) => (
                <div
                    key={step}
                    className="flex items-start"
                >
                    <div className="flex w-28 flex-col items-center text-center">
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

                        <p
                            className={`mt-4 text-lg ${
                                index + 1 === currentStep
                                    ? "font-semibold text-[#0A84E8]"
                                    : "text-gray-700"
                            }`}
                        >
                            {step}
                        </p>
                    </div>

                    {index < steps.length - 1 && (
                        <div className="mt-7 h-[2px] w-10 bg-gray-400" />
                    )}
                </div>
            ))}
        </div>

        {/* Mobile */}
        <div className="mt-10 space-y-6 md:hidden">
            {[firstRow, secondRow].map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex items-start justify-center"
                >
                    {row.map((step) => {
                        const realIndex = steps.indexOf(step);

                        return (
                            <div
                                key={step}
                                className="flex items-start"
                            >
                                <div className="flex w-28 flex-col items-center text-center">
                                    {realIndex + 1 === currentStep ? (
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

                                    <p
                                        className={`mt-3 text-xs ${
                                            realIndex + 1 === currentStep
                                                ? "font-semibold text-[#0A84E8]"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {step}
                                    </p>
                                </div>

                                {realIndex < steps.length - 1 &&
                                    !(rowIndex === 0 && realIndex === 1) && (
                                        <div className="mt-5 h-[2px] w-6 bg-gray-400" />
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    </>
    );
}