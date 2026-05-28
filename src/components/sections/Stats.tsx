type statsItem = {
    label: string;
    value: string;
};

export default function Stats() {
    const stats: statsItem[] = [
        {
            label: "ร้านค้าที่ใช้งาน",
            value: "1.1K+"
        },
        {
            label: "uptime ระบบ",
            value: "99.9%",
        },
        {
            label: "อนุมัติและติดตั้ง",
            value: "<3 วัน"
        },
        {
            label: "ทีมซัพพอร์ต",
            value: "24/7"
        },
    ];

    return(
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="border-gray-200 text-center md:border-r last:border-r-0"
                        >
                            <p className="text-md text-gray-800">{stat.label}</p>
                            <p className="mt-2 text-5xl font-bold text-[#035FC8]">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}