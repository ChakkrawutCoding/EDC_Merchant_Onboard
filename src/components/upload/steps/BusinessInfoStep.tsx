
import { ChevronDown } from "lucide-react";

export default function BusinessInfoStep() {
    return (
        <form className="mt-12 rounded-2xl border border-gray-300 bg-[#F8FBFF] p-8 shadow-sm">
            <div className="grid gap-8 md:grid-cols-2">

                {/* LEFT */}

                <div className="space-y-6">

                    {/* ชื่อกิจการ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            ชื่อกิจการ <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            placeholder="กรุณากรอกชื่อกิจการ"
                            className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                        />
                    </div>

                    {/* ประเภทธุรกิจ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            ประเภทธุรกิจ <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <select className="w-full cursor-pointer appearance-none rounded border border-gray-400 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#0A84E8]">
                                <option>---- กรุณาเลือกประเภทธุรกิจ ----</option>
                            </select>

                            <ChevronDown
                                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </div>

                    {/* เลขประจำตัวผู้เสียภาษี */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            เลขประจำตัวผู้เสียภาษี (Tax ID) <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            placeholder="กรุณากรอกเลขประจำตัวผู้เสียภาษี"
                            className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                        />
                    </div>

                    {/* เบอร์โทรติดต่อ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            เบอร์โทรติดต่อ <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            placeholder="กรุณากรอกเบอร์โทรติดต่อ"
                            className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                        />
                    </div>
                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    {/* ที่อยู่กิจการ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            ที่อยู่กิจการ <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            placeholder="กรุณากรอกที่อยู่กิจการ"
                            className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                        />
                    </div>

                    {/* ถนน, จังหวัด, เขต/อำเภอ */}
                    <div className="grid grid-cols-3 gap-4">

                        {/* ถนน */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                ถนน
                            </label>

                            <input
                                type="text"
                                className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                            />
                        </div>

                        {/* จังหวัด */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                จังหวัด <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select className="w-full cursor-pointer appearance-none rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]">
                                    <option>กรุณาเลือก</option>
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* เขต/อำเภอ */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                เขต/อำเภอ <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select className="w-full cursor-pointer appearance-none rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]">
                                    <option>กรุณาเลือก</option>
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* แขวง/ตำบล, รหัสไปรษณีย์ */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* แขวง/ตำบล */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                แขวง/ตำบล <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select className="w-full cursor-pointer appearance-none rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]">
                                    <option>กรุณาเลือก</option>
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>

                        {/* รหัสไปรษณีย์ */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                รหัสไปรษณีย์ <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                placeholder="เช่น 00000"
                                className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}