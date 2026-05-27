import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="text-2xl font-bold text-blue-600">
                    <Image
                        src="/logo/digio-logo.svg"
                        alt="Digio Logo"
                        width={120}
                        height={40}
                        className="h-auto w-auto"
                    />
                </div>
                <nav className="hidden gap-8 md:flex">
                    <Link href="/" className="text-sm text-gray-700 hover:text-blue-600">
                        EDC คืออะไร
                    </Link>

                    <Link href="/upload" className="text-sm text-gray-700 hover:text-blue-600">
                        อัพโหลดเอกสาร
                    </Link>

                    <Link href="/status" className="text-sm text-gray-700 hover:text-blue-600">
                        ตรวจสอบสถานะ
                    </Link>

                    <Link href="/contact" className="text-sm text-gray-700 hover:text-blue-600">
                        ติดต่อเจ้าหน้าที่
                    </Link>
                </nav>

                <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    เข้าสู่ระบบ
                </button>
            </div>
        </header>
    );
}