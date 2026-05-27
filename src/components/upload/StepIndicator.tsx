export default function StepIndicator() {
  const steps = [
    "กรอกข้อมูล",
    "หนังสือรับรองบริษัท",
    "บัตรประชาชน",
    "สแกนใบหน้า",
    "สมุดเงินฝากธนาคาร",
  ];

  return (
    <div className="mt-10 flex items-start justify-center">
        {steps.map((step, index) => (
            <div
                key={index}
                className="flex items-start"
            >
            <div className="flex w-28 flex-col items-center text-center">
                {index === 0 ? (
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
                className={`mt-4 text-lg leading-snug ${
                    index === 0
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
    );
}