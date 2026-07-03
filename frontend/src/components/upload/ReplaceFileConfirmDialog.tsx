"use client";

import { OctagonAlert } from "lucide-react";
import { motion } from "framer-motion";

type ReplaceFileConfirmDialogProps = {
    open: boolean;
    fileLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ReplaceFileConfirmDialog({
    open,
    fileLabel,
    onConfirm,
    onCancel,
}: ReplaceFileConfirmDialogProps) {
    if (!open) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut"  }}
        >
            <motion.div
                className="w-full max-w-[804px] overflow-hidden rounded-2xl border border-amber-300 bg-[#FFFDF0] shadow-2xl"
                initial={{ opacity: 0, scale: 0.8, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
            >
                <div className="h-8 bg-[#FFD268]" />

                <div className="flex flex-col gap-6 p-6">
                    <div className="flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFD268] text-black">
                            <OctagonAlert className="h-16 w-16 stroke-[2]" />
                        </div>
                    </div>

                    <div className="mx-auto max-w-[620px] text-center">
                        <h2 className="text-2xl font-bold text-amber-500">
                            กำลังอัปโหลดทับไฟล์เดิม
                        </h2>

                        <p className="mt-2 text-base leading-relaxed text-gray-800">
                            การอัปโหลดไฟล์ใหม่จะแทนที่ไฟล์ {fileLabel} เดิมที่อัปโหลดไว้
                            คุณต้องการดำเนินการต่อหรือไม่?
                        </p>
                    </div>

                    <div className="flex w-full gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="h-11 flex-1 rounded-lg border border-amber-400 bg-white px-4 text-base font-semibold text-amber-500 transition hover:bg-amber-50"
                        >
                            ยกเลิก
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            className="h-11 flex-1 rounded-lg bg-amber-500 px-4 text-base font-semibold text-white transition hover:bg-amber-600"
                        >
                            แทนที่ไฟล์
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
