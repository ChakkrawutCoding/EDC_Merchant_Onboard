import Image from "next/image";

export default function ContactHero() {
    return (
        <section className="bg-gradient-to-r from-[#061548] to-[#1782D1]">
            <div className="mx-auto grid max-w-7xl items-center gap-8 px-8 py-12 md:grid-cols-2">

                <div className="text-white">

                    <h1 className="text-5xl font-bold">
                        ติดต่อเจ้าหน้าที่
                    </h1>

                    <p className="mt-8 text-xl leading-relaxed">
                        หากพบปัญหาระหว่างการสมัครใช้งาน หรือต้องการความช่วยเหลือเกี่ยวกับเอกสาร การยืนยันตัวตน หรือการตรวจสอบสถานะ ทีมงานพร้อมช่วยดูแลคุณ
                    </p>

                    <div className="mt-10 space-y-3 text-xl font-semibold">
                        <p>โทร : Xxx-xxx-xxxx</p>
                        <p>Email : admin@gmail.com</p>
                    </div>
            
                </div>

                <div >
                    <Image
                        src="/img/support-banner.png"
                        alt="Support Team"
                        width={700}
                        height={500}
                        className="h-auto w-full object-contain"
                    />
                </div>
            </div>
        </section>
    );
}