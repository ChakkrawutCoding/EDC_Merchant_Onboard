import { FileText, CheckCircle2 } from "lucide-react";

import { useState } from "react";

import type { FormData } from "@/types/form";

type BankBookStepProps = {
    formData: FormData;

    setFormData: React.Dispatch<
        React.SetStateAction<FormData>
    >;

    disabled?: boolean;
};

export default function BankBookStep({ formData, setFormData, disabled = false, } : BankBookStepProps) {

    const bankBookExample = "/img/Bankbook.png";

    const MAX_FILE_SIZE_MB = 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const [isReadingFile, setIsReadingFile] = useState(false);
    const [readProgress, setReadProgress] = useState(0);
    const [readingFileName, setReadingFileName] = useState("");

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isExamplePreviewOpen, setIsExamplePreviewOpen] = useState(false);

    const fileToBase64 = (file: File, onProgress: (loaded: number, total: number) => void): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onprogress = (event) => {
                if (!event.lengthComputable) return;

                onProgress(event.loaded, event.total);
            };

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    };
    
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (disabled) {
            event.target.value = "";
            return;
        }
        
        const file = event.target.files?.[0];

        if (!file) return;

        if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(`ไฟล์ต้องมีขนาดไม่เกิน ${MAX_FILE_SIZE_MB}MB`);
            event.target.value = "";
            return;
        }

        setIsReadingFile(true);
        setReadProgress(0);
        setReadingFileName(file.name);

        try {
            const base64 = await fileToBase64(file, (loaded, total) => {
                setReadProgress(Math.round((loaded / total) * 100));
            });

            await new Promise((r) => setTimeout(r, 1000));

            setFormData((prev) => ({
                ...prev,
                bankBook: {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    base64,
                },
            }));
        } finally {
            setIsReadingFile(false);
        }
    };

    return (
        <div className="mt-10 flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-12">
            {isReadingFile ? (
                <div className="flex h-[440px] w-full max-w-[490px] lg:w-[490px] flex-col rounded-3xl border border-gray-300 bg-white p-6 shadow-sm dark:bg-[#252731] transition duration-1000">
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-500 bg-[#F8FBFF] px-8 dark:bg-[#161823] dark:border-[#252731] transition duration-1000">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />

                        <div className="mt-12 w-full">
                            <div className="h-3 overflow-hidden rounded-full bg-blue-100">
                                <div
                                    className="h-full rounded-full bg-[#0A84E8] transition-all duration-200"
                                    style={{ width: `${readProgress}%` }}
                                />
                            </div>

                            <div className="mt-3 flex justify-between gap-3 text-sm text-gray-900 dark:text-gray-300 transition duration-1000">
                                <div className="min-w-0">
                                    <p>กำลังโหลดไฟล์</p>
                                    <p className="truncate text-gray-500">
                                        {readingFileName}
                                    </p>
                                </div>

                                <span className="shrink-0">{readProgress}%</span>
                            </div>
                        </div>
                    </div>
                </div> 

            ) : formData.bankBook ? (

                /* Uploaded State */
                <div className="flex h-[440px] w-full max-w-[490px] lg:w-[490px] flex-col rounded-3xl border border-gray-300 bg-white p-4 shadow-sm dark:bg-[#161823] dark:border-[#252731] transition duration-1000">

                    <div 
                        onClick={() => setIsPreviewOpen(true)}
                        className="relative flex flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-[#252731] transition duration-1000"
                    >

                        <div className="absolute inset-0 z-10" />

                        {formData.bankBook?.type?.startsWith("image/") ? (

                            <img
                                src={formData.bankBook.base64}
                                alt="Preview"
                                className="h-full w-full object-contain"
                            />

                        ) : formData.bankBook?.type === "application/pdf" ? (

                            <iframe
                                src={formData.bankBook.base64}
                                className="h-full w-full"
                            />

                        ) : (

                            <FileText className="h-24 w-24 text-gray-400" />

                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="max-w-[200px] truncate text-sm font-medium text-gray-900 dark:text-gray-300 transition duration-1000">
                                {formData.bankBook.name}
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                อัปโหลดสำเร็จ
                            </div>
                        </div>

                        <label
                            className={`text-sm font-medium ${
                                disabled
                                    ? "cursor-not-allowed text-gray-400"
                                    : "cursor-pointer text-[#0A84E8] hover:underline"
                            }`}
                        >
                            อัปโหลด

                            <input
                                type="file"
                                disabled={disabled}
                                accept=".pdf,.jpg,.jpeg,.png"
                                hidden
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>

            ) : (

                /* Empty Upload State */
                <label
                    className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
                >
                    <input
                        type="file"
                        disabled={disabled}
                        accept=".pdf,.jpg,.jpeg,.png"
                        hidden
                        onChange={handleFileChange}
                    />

                    <div
                        className={`flex h-[440px] w-full max-w-[490px] lg:w-[490px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-400 bg-[#F8FBFF] p-10 text-center dark:bg-[#161823] dark:border-[#252731] transition duration-1000${
                            disabled
                                ? "opacity-50"
                                : "hover:border-[#0A84E8] hover:bg-blue-50 dark:hover:bg-[#252731]"
                        }`}
                    >

                        <FileText className="h-20 w-20 text-gray-700" />

                        <p className="mt-6 text-lg text-gray-700 transition duration-1000 dark:text-gray-300">
                            อัปโหลดไฟล์ (PDF, JPG, PNG)
                        </p>

                        <p className="mt-1 text-md text-gray-500 transition duration-1000 dark:text-gray-400">
                            ไฟล์ขนาดสูงสุด 5MB
                        </p>
                    </div>
                </label>

            )}

            {/* Example Section */}
            <div className="flex h-[440px] w-full max-w-[320px] lg:w-[320px] flex-col items-center overflow-hidden rounded-3xl border 
            border-gray-300 bg-white p-6 shadow-sm dark:bg-[#161823] dark:border-[#252731] transition duration-1000">

                <h3 className="text-3xl font-bold text-gray-900 transition duration-1000 dark:text-gray-300">
                    ตัวอย่าง
                </h3>

                <div
                    onClick={() => setIsExamplePreviewOpen(true)}
                    className="mt-4 flex flex-1 items-center cursor-pointer justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-[#252731] transition duration-1000"
                >
                    <img
                        src={bankBookExample}
                        alt="ตัวอย่างเอกสาร"
                        className="h-full w-full object-contain"
                    />
                </div>
            </div>

            {isPreviewOpen && ( //Pop up Preview kub
                <div
                    onClick={() => setIsPreviewOpen(false)}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                >

                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-white p-4 dark:bg-[#252731] transition duration-1000"
                    >

                        {formData.bankBook?.type?.startsWith("image/") ? (

                            <img
                                src={formData.bankBook.base64}
                                alt="Preview"
                                className="max-h-[80vh] w-auto object-contain"
                            />

                        ) : formData.bankBook?.type === "application/pdf" ? (

                            <iframe
                                src={formData.bankBook.base64}
                                className="h-[80vh] w-[70vw]"
                            />

                        ) : null}
                    </div>
                </div>
            )}

            {isExamplePreviewOpen && ( //Pop up Preview kub
                <div
                    onClick={() => setIsExamplePreviewOpen(false)}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
                >

                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-white p-4 dark:bg-[#252731] transition duration-1000"
                    >
                        <img
                            src={bankBookExample}
                            alt="Preview"
                            className="max-h-[80vh] w-auto object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
