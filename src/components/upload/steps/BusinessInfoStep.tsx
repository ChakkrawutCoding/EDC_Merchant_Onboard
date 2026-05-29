"use client"
import { ChevronDown } from "lucide-react";

import type { FormData } from "@/types/form";

import provinces from "@/data/provinces.json";
import districts from "@/data/districts.json";
import subDistricts from "@/data/subDistricts.json";

type BusinessInfoStepProps = {
    formData: FormData;

    setFormData: React.Dispatch<
        React.SetStateAction<FormData>
    >;
};

export default function BusinessInfoStep({ formData, setFormData, }: BusinessInfoStepProps) {

    const businessTypes = [
        "ร้านอาหาร / คาเฟ่",
        "ร้านค้าปลีก",
        "ร้านสะดวกซื้อ / มินิมาร์ท",
        "ร้านเสื้อผ้า / แฟชั่น",
        "ร้านเสริมสวย / สปา / คลินิกความงาม",
        "โรงแรม / ที่พัก",
        "ธุรกิจท่องเที่ยว",
        "ร้านขายยา / สุขภาพ",
        "คลินิก / สถานพยาบาล",
        "ธุรกิจการศึกษา / สถาบันกวดวิชา",
        "ร้านอุปกรณ์อิเล็กทรอนิกส์",
        "ร้านเฟอร์นิเจอร์ / ของแต่งบ้าน",
        "ร้านทอง / เครื่องประดับ",
        "ธุรกิจขนส่ง / โลจิสติกส์",
        "บริการซ่อม / ช่าง",
        "ร้านซักรีด / บริการทั่วไป",
        "ธุรกิจออนไลน์ / E-Commerce",
        "ฟรีแลนซ์ / ผู้ประกอบการรายย่อย",
        "ค้าส่ง",
        "ธุรกิจบันเทิง / อีเวนต์",
        "ปั๊มน้ำมัน / EV Charger",
        "อื่น ๆ",
    ];

    const provinceId = formData.province ? Number(formData.province) : null;
    const districtId = formData.district ? Number(formData.district) : null;
    const subDistrictId = formData.subDistrict ? Number(formData.subDistrict) : null;

    const filteredDistricts = districts.filter(
        (district) => district.PROVINCE_ID === provinceId
    );

    const filteredSubDistricts = subDistricts.filter(
        (subDistrict) => subDistrict.DISTRICT_ID === districtId
    );

    return (
        <div className="mt-12 rounded-2xl border border-gray-300 bg-[#F8FBFF] p-8 shadow-sm">
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
                            value={formData.businessName}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    businessName: e.target.value,
                                }))
                            }
                            required
                            placeholder="กรุณากรอกชื่อกิจการ"
                            className="w-full placeholder:text-gray-400 text-black rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                        />
                    </div>

                    {/* ประเภทธุรกิจ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            ประเภทธุรกิจ <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <select 
                                value={formData.businessType}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        businessType: e.target.value,
                                        otherBusinessType: e.target.value === "อื่น ๆ" ? prev.otherBusinessType : "",
                                    }));
                                }}
                                required
                                className="w-full cursor-pointer appearance-none text-black rounded border border-gray-400 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#0A84E8]"
                            >
                                <option value="">---- กรุณาเลือกประเภทธุรกิจ ----</option>

                                {businessTypes.map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </select>
                            
                            
                            <ChevronDown
                                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </div>
                    
                    {/* In-case อื่น ๆ */}
                    {formData.businessType === "อื่น ๆ" && (
                        <div className="mt-3">
                            <input
                            type="text"
                            value={formData.otherBusinessType}
                            onChange={(e) => 
                                setFormData((prev) => ({
                                    ...prev,
                                    otherBusinessType: e.target.value,
                                }))
                            }
                            required
                            placeholder="กรุณาระบุประเภทธุรกิจ"
                            className="w-full placeholder:text-gray-400 text-black rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                            />
                        </div>
                    )}

                    {/* เลขประจำตัวผู้เสียภาษี */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            เลขประจำตัวผู้เสียภาษี (Tax ID) <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            value={formData.taxId}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                ...prev,
                                taxId: e.target.value,
                                }))
                            }
                            required
                            placeholder="กรุณากรอกเลขประจำตัวผู้เสียภาษี"
                            className="w-full placeholder:text-gray-400 text-black rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                        />
                    </div>

                    {/* เบอร์โทรติดต่อ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            เบอร์โทรติดต่อ <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            value={formData.tel}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                ...prev,
                                tel: e.target.value,
                                }))
                            }
                            required
                            placeholder="กรุณากรอกเบอร์โทรติดต่อ"
                            className="w-full placeholder:text-gray-400 text-black rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
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
                            value={formData.businessAddress}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                ...prev,
                                businessAddress: e.target.value,
                                }))
                            }
                            required
                            placeholder="กรุณากรอกที่อยู่กิจการ"
                            className="w-full placeholder:text-gray-400 text-black rounded border border-gray-400 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                        />
                    </div>

                    {/* ถนน, จังหวัด, เขต/อำเภอ */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* ถนน */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                ถนน
                            </label>

                            <input
                                type="text"
                                value={formData.road}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                    ...prev,
                                    road: e.target.value,
                                    }))
                                }
                                className="w-full rounded border border-gray-400 text-black bg-white px-3 py-2 text-sm outline-none focus:border-[#0A84E8]"
                            />
                        </div>

                        {/* จังหวัด */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                จังหวัด <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select
                                    value={provinceId ?? ""}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            province: e.target.value,
                                            district: "",
                                            subDistrict: "",
                                        }));
                                    }}
                                    required
                                    className="w-full cursor-pointer appearance-none rounded text-black border border-gray-400 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#0A84E8]"
                                >
                                    <option value="">กรุณาเลือก</option>

                                    {[...provinces]
                                        .sort((a, b) =>
                                            a.PROVINCE_NAME.localeCompare(
                                                b.PROVINCE_NAME,
                                                "th"
                                            )
                                        )
                                        .map((province) => (
                                            <option
                                                key={province.PROVINCE_ID}
                                                value={province.PROVINCE_ID}
                                                className="text-black"
                                            >
                                                {province.PROVINCE_NAME}
                                            </option>
                                    ))}
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
                                <select 
                                    value={districtId ?? ""}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            district: e.target.value,
                                            subDistrict: "",
                                        }));
                                    }}
                                    required
                                    className="w-full cursor-pointer appearance-none text-black rounded border border-gray-400 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#0A84E8]"
                                >
                                    <option value="">กรุณาเลือก</option>

                                    {[...filteredDistricts]
                                        .sort((a, b) =>
                                            a.DISTRICT_NAME.localeCompare(
                                                b.DISTRICT_NAME,
                                                "th"
                                            )
                                        )
                                        .map((district) => (
                                            <option
                                                key={district.DISTRICT_ID}
                                                value={district.DISTRICT_ID}
                                                className="text-black"
                                            >
                                                {district.DISTRICT_NAME}
                                            </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* แขวง/ตำบล, รหัสไปรษณีย์ */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* แขวง/ตำบล */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900">
                                แขวง/ตำบล <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select
                                    value={subDistrictId ?? ""}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            subDistrict: e.target.value,
                                        }));
                                    }}
                                    required
                                    className="w-full cursor-pointer appearance-none text-black rounded border border-gray-400 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#0A84E8]"
                                >
                                    <option value="">กรุณาเลือก</option>
                                    
                                    {[...filteredSubDistricts]
                                        .sort((a, b) =>
                                            a.SUB_DISTRICT_NAME.localeCompare(
                                                b.SUB_DISTRICT_NAME,
                                                "th"
                                            )
                                        )
                                        .map((subDistrict) => (
                                            <option
                                                key={subDistrict.SUB_DISTRICT_ID}
                                                value={subDistrict.SUB_DISTRICT_ID}
                                                className="text-black"
                                            >
                                                {subDistrict.SUB_DISTRICT_NAME}
                                            </option>
                                    ))}
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
                                value={formData.zipcode}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        zipcode: e.target.value,
                                    }))
                                }
                                required
                                placeholder="เช่น 00000"
                                className="w-full placeholder:text-gray-400 text-black rounded border border-gray-400 bg-white px-3 py-2 pr-10 text-sm outline-none focus:border-[#0A84E8]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}