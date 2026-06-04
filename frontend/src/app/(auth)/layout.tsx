import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#EAF5FB] md:grid md:grid-cols-2">
        <section className="hidden bg-[#173E67] p-10 text-white md:flex md:flex-col md:justify-between">
            <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2">
            <Image
                src="/logo/digio-logo.svg"
                alt="Digio Logo"
                width={56}
                height={40}
                className="h-auto w-auto"
            />
            </div>

            <div>
                <p className="text-3xl font-bold">Digio</p>
                <p className="text-lg text-white/70">Payment Simplified</p>
            </div>
            </div>

            <h1 className="max-w-md text-5xl font-bold leading-tight">
            Welcome to be your Business helper
            </h1>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">{children}</div>
        </section>
        </main>
    );
}