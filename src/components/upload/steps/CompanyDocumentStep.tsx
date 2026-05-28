import { FileText, CheckCircle2 } from "lucide-react";

import { useState } from "react";

import type { FormData } from "@/types/form";

type CompanyDocumentStepProps = {
    formData: FormData;

    setFormData: React.Dispatch<
        React.SetStateAction<FormData>
    >;
};

export default function CompanyDocumentStep({ formData, setFormData, } : CompanyDocumentStepProps) {
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            companyCertificate: file,
        }));
    };

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <div className="mt-10 flex justify-center gap-6">

            {/* Upload Section */}
            {formData.companyCertificate ? (

                /* Uploaded State */
                <div className="flex h-[320px] w-[350px] flex-col rounded-3xl border border-gray-300 bg-white p-4 shadow-sm">

                    <div 
                        onClick={() => setIsPreviewOpen(true)}
                        className="relative flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gray-100"
                    >

                        <div className="absolute inset-0 z-10" />

                        {formData.companyCertificate?.type?.startsWith("image/") ? (

                            <img
                                src={URL.createObjectURL(formData.companyCertificate)}
                                alt="Preview"
                                className="h-full w-full object-contain"
                            />

                        ) : formData.companyCertificate?.type === "application/pdf" ? (

                            <iframe
                                src={URL.createObjectURL(formData.companyCertificate)}
                                className="h-full w-full"
                            />

                        ) : (

                            <FileText className="h-24 w-24 text-gray-400" />

                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="max-w-[200px] truncate text-sm font-medium text-gray-900">
                                {formData.companyCertificate.name}
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                อัปโหลดสำเร็จ
                            </div>
                        </div>

                        <label className="cursor-pointer text-sm font-medium text-[#0A84E8] hover:underline">
                            อัปโหลด

                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                hidden
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>

            ) : (

                /* Empty Upload State */
                <label className="cursor-pointer">
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        hidden
                        onChange={handleFileChange}
                    />

                    <div className="flex h-[320px] w-[350px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-400 bg-[#F8FBFF] p-10 text-center transition hover:border-[#0A84E8] hover:bg-blue-50">

                        <FileText className="h-20 w-20 text-gray-700" />

                        <p className="mt-6 text-lg text-gray-700">
                            อัปโหลดไฟล์ (PDF, JPG, PNG)
                        </p>

                        <p className="mt-1 text-md text-gray-500">
                            ไฟล์ขนาดสูงสุด 10MB
                        </p>
                    </div>
                </label>

            )}

            {/* Example Section */}
            <div className="flex h-[320px] w-[220px] flex-col items-center overflow-hidden rounded-3xl border border-gray-300 bg-white p-6 shadow-sm">

                <h3 className="text-3xl font-bold text-gray-900">
                    ตัวอย่าง
                </h3>

                <div 
                    //onClick={() => setIsPreviewOpen(true)}
                    className="mt-4 flex flex-1 items-center cursor-pointer justify-center rounded-xl bg-gray-100 px-4 text-center text-gray-500"
                >
                    รูปตัวอย่างเอกสาร
                </div>
            </div>

            {isPreviewOpen && ( //Pop up Preview kub
                <div
                    onClick={() => setIsPreviewOpen(false)}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                >

                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-white p-4"
                    >

                        {formData.companyCertificate?.type?.startsWith("image/") ? (

                            <img
                                src={URL.createObjectURL(formData.companyCertificate)}
                                alt="Preview"
                                className="max-h-[80vh] w-auto object-contain"
                            />

                        ) : formData.companyCertificate?.type === "application/pdf" ? (

                            <iframe
                                src={URL.createObjectURL(formData.companyCertificate)}
                                className="h-[80vh] w-[70vw]"
                            />

                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}