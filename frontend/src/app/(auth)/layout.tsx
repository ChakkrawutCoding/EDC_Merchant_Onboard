import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#EAF5FB] md:grid md:grid-cols-2">
            <section className="relative hidden min-h-screen overflow-hidden p-10 text-white md:flex md:flex-col md:justify-between">
                <Image
                    src="/img/authentication-bg.png"
                    alt=""
                    fill
                    priority
                    quality={100}
                    sizes="50vw"
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-[#0F3358]/45" />

                <div className="relative z-10 flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-1 shadow-lg">
                        <Image
                        src="/logo/digio-logo-with-sub.svg"
                        alt="Digio Logo"
                        width={100}
                        height={100}
                        className="h-auto w-auto"
                        priority
                        />
                    </div>

                    <div>
                        <p className="text-3xl font-bold text-white">Digio</p>
                        <p className="text-lg font-medium text-white/75">Payment Simplified</p>
                    </div>
                </div>

                <h1 className="relative z-10 max-w-md text-5xl font-bold leading-tight">
                    Welcome to be your Business helper
                </h1>
            </section>

            <section className="flex min-h-screen items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">{children}</div>
            </section>
        </main>
    );
}