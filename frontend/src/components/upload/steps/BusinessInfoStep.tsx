"use client"
import { ChevronDown } from "lucide-react";

import type { FormData } from "@/types/form";

import { useState } from "react";

import provinces from "@/data/provinces.json";
import districts from "@/data/districts.json";
import subDistricts from "@/data/subDistricts.json";
import { div } from "framer-motion/client";

type BusinessInfoStepProps = {
    formData: FormData;

    setFormData: React.Dispatch<
        React.SetStateAction<FormData>
    >;

    disabled?: boolean;
};

export default function BusinessInfoStep({ formData, setFormData, disabled = false, }: BusinessInfoStepProps) {

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

    const [telError, setTelError] = useState("");
    const [taxIdError, setTaxIdError] = useState("");
    const [zipcodeError, setZipcodeError] = useState("");
    
    const BUSINESS_NAME_MAX_LENGTH = 255;
    const BUSINESS_TYPE_NAME_MAX_LENGTH = 100;
    const TAX_ID_MAX_LENGTH = 13;
    const BUSINESS_ADDRESS_MAX_LENGTH = 255;
    const ROAD_MAX_LENGTH = 100;
    const ZIPCODE_MAX_LENGTH = 5;

    const filteredDistricts = districts.filter(
        (district) => district.PROVINCE_ID === provinceId
    );

    const filteredSubDistricts = subDistricts.filter(
        (subDistrict) => subDistrict.DISTRICT_ID === districtId
    );

    const inputClass = `w-full rounded border border-gray-400 px-3 py-2 text-sm outline-none placeholder:text-gray-400 transition duration-1000
                        dark:bg-[#1D1F28] dark:border-[#3B3E4D] dark:placeholder:text-gray-500 placeholder:transition placeholder:duration-1000 dark:text-white ${
        disabled
            ? "cursor-not-allowed bg-gray-100 text-gray-500"
            : "bg-white text-black focus:border-[#0A84E8]"
    }`;

    const selectClass = `w-full appearance-none rounded border border-gray-400 px-3 py-2 pr-10 text-sm outline-none transition duration-1000
                        dark:bg-[#1D1F28] dark:border-[#3B3E4D] dark:text-white ${
        disabled
            ? "cursor-not-allowed bg-gray-100 text-gray-500"
            : "cursor-pointer bg-white text-black focus:border-[#0A84E8]"
    }`;

    return (
        <div className="mt-12 rounded-2xl border border-gray-300 bg-[#F8FBFF] p-8 shadow-sm dark:bg-[#161823] dark:border-[#252731] transition duration-1000">
            <div className="grid gap-8 md:grid-cols-2">

                {/* LEFT */}

                <div className="space-y-6">

                    {/* ชื่อกิจการ */}
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                ชื่อกิจการ <span className="text-red-500">*</span>
                            </label>

                            <span
                                className={`text-xs ${
                                    formData.businessName.length >= BUSINESS_NAME_MAX_LENGTH
                                        ? "text-red-500"
                                        : "text-gray-500 dark:text-gray-300 transition duration-1000"
                                }`}
                            >
                                {formData.businessName.length}/{BUSINESS_NAME_MAX_LENGTH}
                            </span>
                        </div>


                        <input
                            type="text"
                            disabled={disabled}
                            maxLength={BUSINESS_NAME_MAX_LENGTH}
                            value={formData.businessName}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    businessName: e.target.value,
                                }))
                            }}
                            required
                            placeholder="กรุณากรอกชื่อกิจการ"
                            className={inputClass}
                        />
                    </div>

                    {/* ประเภทธุรกิจ */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                            ประเภทธุรกิจ <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <select 
                                disabled={disabled}
                                value={formData.businessType}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        businessType: e.target.value,
                                        otherBusinessType: e.target.value === "อื่น ๆ" ? prev.otherBusinessType : "",
                                    }));
                                }}
                                required
                                className={selectClass}
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
                                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-300 transition duration-1000"
                            />
                        </div>
                    </div>
                    
                    {/* In-case อื่น ๆ */}
                    {formData.businessType === "อื่น ๆ" && (
                        <div>
                            <div className="mb-2 flex justify-end">
                                <label
                                        className={`text-xs ${
                                            formData.otherBusinessType.length >= BUSINESS_TYPE_NAME_MAX_LENGTH
                                                ? "text-red-500"
                                                : "text-gray-500 dark:text-gray-300 transition duration-1000"
                                        }`}
                                    >
                                        {formData.otherBusinessType.length}/{BUSINESS_TYPE_NAME_MAX_LENGTH}
                                </label>
                            </div>

                            <div className="mt-3">
                                <input
                                type="text"
                                disabled={disabled}
                                maxLength={BUSINESS_TYPE_NAME_MAX_LENGTH}
                                value={formData.otherBusinessType}
                                onChange={(e) => 
                                    setFormData((prev) => ({
                                        ...prev,
                                        otherBusinessType: e.target.value,
                                    }))
                                }
                                required
                                placeholder="กรุณาระบุประเภทธุรกิจ"
                                className={inputClass}
                                />
                            </div>
                        </div>
                    )}

                    {/* เลขประจำตัวผู้เสียภาษี */}
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                เลขประจำตัวผู้เสียภาษี (Tax ID) <span className="text-red-500">*</span>
                            </label>

                            <span
                                className="text-xs text-gray-500 dark:text-gray-300 transition duration-1000"
                            >
                                {formData.taxId.length}/{TAX_ID_MAX_LENGTH}
                            </span>
                        </div>
                        

                        <input
                            type="text"
                            disabled={disabled}
                            value={formData.taxId}
                            onChange={(e) => {
                                const rawValue = e.target.value;
                                const onlyNumbers = rawValue.replace(/\D/g, "");
                                if (rawValue !== onlyNumbers) {
                                    setTaxIdError("กรอกเฉพาะตัวเลขเท่านั้น");
                                } else if (onlyNumbers.length < 13) {
                                    setTaxIdError(`กรุณากรอกเลขประจำตัวผู้เสียภาษีให้ครบ ${TAX_ID_MAX_LENGTH} หลัก`);
                                } else {
                                    setTaxIdError("");
                                }

                                setFormData((prev) => ({
                                    ...prev,
                                    taxId: onlyNumbers.slice(0, TAX_ID_MAX_LENGTH),
                                }))
                            }}
                            required
                            placeholder="กรุณากรอกเลขประจำตัวผู้เสียภาษี"
                            className={inputClass}
                        />

                        {taxIdError && (
                            <p className="mt-1 text-xs text-red-500 dark:text-[#FF5858] transition duration-1000">
                                {taxIdError}
                            </p>
                        )}
                    </div>

                    {/* เบอร์โทรติดต่อ */}
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                เบอร์โทรติดต่อ <span className="text-red-500">*</span>
                            </label>

                            <span
                                className="text-xs text-gray-500 dark:text-gray-300 transition duration-1000"
                            >
                                {formData.tel.length}/10
                            </span>
                        </div>


                        <input
                            type="text"
                            disabled={disabled}
                            value={formData.tel}
                            onChange={(e) => {
                                const rawValue = e.target.value;
                                const onlyNumbers = rawValue.replace(/\D/g, "");
                                if (rawValue !== onlyNumbers) {
                                    setTelError("กรอกเฉพาะตัวเลขเท่านั้น");
                                } else if (onlyNumbers.length < 9) {
                                    setTelError(`กรุณากรอกเบอร์ติดต่อ 9-10 หลัก`);
                                } else {
                                    setTelError("");
                                }

                                setFormData((prev) => ({
                                    ...prev,
                                    tel: onlyNumbers.slice(0, 10),
                                }))
                            }}
                            required
                            placeholder="กรุณากรอกเบอร์โทรติดต่อ"
                            className={inputClass}
                        />

                        {telError && (
                            <p className="mt-1 text-xs text-red-500 dark:text-[#FF5858] transition duration-1000">
                                {telError}
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    {/* ที่อยู่กิจการ */}
                    <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                ที่อยู่กิจการ <span className="text-red-500">*</span>
                            </label>

                            <span
                                className={`text-xs ${
                                    formData.businessAddress.length >= BUSINESS_ADDRESS_MAX_LENGTH
                                        ? "text-red-500"
                                        : "text-gray-500 dark:text-gray-300 transition duration-1000"
                                }`}
                            >
                                {formData.businessAddress.length}/{BUSINESS_ADDRESS_MAX_LENGTH}
                            </span>
                        </div>
                        
                        <input
                            type="text"
                            disabled={disabled}
                            maxLength={BUSINESS_ADDRESS_MAX_LENGTH}
                            value={formData.businessAddress}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                ...prev,
                                businessAddress: e.target.value,
                                }))
                            }
                            required
                            placeholder="กรุณากรอกที่อยู่กิจการ"
                            className={inputClass}
                        />
                    </div>

                    {/* ถนน, จังหวัด, เขต/อำเภอ */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* ถนน */}
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                    ถนน
                                </label>

                                <span
                                    className={`text-xs ${
                                        formData.road.length >= ROAD_MAX_LENGTH
                                            ? "text-red-500"
                                            : "text-gray-500 dark:text-gray-300 transition duration-1000"
                                    }`}
                                >
                                    {formData.road.length}/{ROAD_MAX_LENGTH}
                                </span>
                            </div>
                            

                            <input
                                type="text"
                                disabled={disabled}
                                maxLength={ROAD_MAX_LENGTH}
                                value={formData.road}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                    ...prev,
                                    road: e.target.value,
                                    }))
                                }
                                className={inputClass}
                            />
                        </div>

                        {/* จังหวัด */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                จังหวัด <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select
                                    disabled={disabled}
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
                                    className={selectClass}
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
                                            >
                                                {province.PROVINCE_NAME}
                                            </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-300 transition duration-1000"
                                />
                            </div>
                        </div>

                        {/* เขต/อำเภอ */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                เขต/อำเภอ <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select 
                                    disabled={disabled}
                                    value={districtId ?? ""}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            district: e.target.value,
                                            subDistrict: "",
                                        }));
                                    }}
                                    required
                                    className={selectClass}
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
                                            >
                                                {district.DISTRICT_NAME}
                                            </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-300 transition duration-1000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* แขวง/ตำบล, รหัสไปรษณีย์ */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* แขวง/ตำบล */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                แขวง/ตำบล <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <select
                                    disabled={disabled}
                                    value={subDistrictId ?? ""}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            subDistrict: e.target.value,
                                        }));
                                    }}
                                    required
                                    className={selectClass}
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
                                            >
                                                {subDistrict.SUB_DISTRICT_NAME}
                                            </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-300 transition duration-1000"
                                />
                            </div>
                        </div>

                        {/* รหัสไปรษณีย์ */}
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white transition duration-1000">
                                    รหัสไปรษณีย์ <span className="text-red-500">*</span>
                                </label>

                                <span
                                    className="text-xs text-gray-500 dark:text-gray-300 transition duration-1000"
                                >
                                    {formData.zipcode.length}/{ZIPCODE_MAX_LENGTH}
                                </span>
                            </div>
                            
                            <input
                                type="text"
                                disabled={disabled}
                                value={formData.zipcode}
                                onChange={(e) => {
                                    const rawValue = e.target.value;
                                    const onlyNumbers = rawValue.replace(/\D/g, "");
                                    if (rawValue !== onlyNumbers) {
                                        setZipcodeError("กรอกเฉพาะตัวเลขเท่านั้น");
                                    } else if (onlyNumbers.length < ZIPCODE_MAX_LENGTH) {
                                        setZipcodeError("กรุณากรอกรหัสไปรษณีย์ 5 หลัก");
                                    } else {
                                        setZipcodeError("");
                                    }
                                    setFormData((prev) => ({
                                        ...prev,
                                        zipcode: onlyNumbers.slice(0, ZIPCODE_MAX_LENGTH),
                                    }))
                                }}
                                required
                                placeholder="เช่น 00000"
                                className={inputClass}
                            />

                            {zipcodeError && (
                                <p className="mt-1 text-xs text-red-500 dark:text-[#FF5858] transition duration-1000">
                                    {zipcodeError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
