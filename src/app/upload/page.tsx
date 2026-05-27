import Navbar from "@/components/layout/Navbar";
import StepIndicator from "@/components/upload/StepIndicator";

export default function UploadPage() {
    return (
        <main className="min-h-screen bg-[#EAF5FB]">
        <Navbar />

        <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 md:text-6xl">
                สมัครใช้งานเครื่องรูดบัตร{" "}
                <span className="text-[#0A84E8]">EDC</span>
            </h1>

            <p className="mt-3 text-gray-600">
                ง่าย ๆ ภายใน 5 ขั้นตอน
            </p>
            </div>

            <StepIndicator />
        </section>
        </main>
    );
}