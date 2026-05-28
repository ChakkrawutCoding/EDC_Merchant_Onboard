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

  return (
    <div className="mt-10 flex items-start justify-center px-2 md:px-4">
        {steps.map((step, index) => (
            <div
                key={index}
                className="flex items-start shrink-0"
            >
            <div className="flex w-20 md:w-28 flex-col items-center text-center">
                {index + 1 === currentStep ? (
                    <div className="relative flex h-12 w-12 md:h-16 md:w-16 items-center justify-center">
                        <div className="absolute inset-0 animate-slow-spin rounded-full bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300" />

                        <div className="absolute inset-[4px] md:inset-[5px] flex items-center justify-center rounded-full bg-[#0A84E8] text-lg md:text-2xl font-bold text-white shadow-md">
                        {index + 1}
                        </div>
                    </div>
                    ) : (
                    <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-slate-500 text-base md:text-2xl font-bold text-white shadow-md">
                        {index + 1}
                    </div>
                )}

                <p
                className={`mt-3 text-xs md:mt-4 md:text-lg ${
                    index + 1 === currentStep
                    ? "font-semibold text-[#0A84E8]"
                    : "text-gray-700"
                }`}
                >
                {step}
                </p>
            </div>

            {index < steps.length - 1 && (
                <div className="mt-5 w-6 md:mt-7 md:w-10 h-[2px] bg-gray-400" />
            )}
            </div>
        ))}
        </div>
    );
}