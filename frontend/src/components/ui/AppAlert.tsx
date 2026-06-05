"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

type AlertVariant = "default" | "success" | "danger" | "warning";

type AppAlertProps = {
    message: string;
    variant?: AlertVariant;
    onClose: () => void;
};

const alertStyles = {
    default: {
        box: "border-gray-500 border-l-gray-500 bg-gray-100 text-gray-900",
        icon: "border-gray-400 text-gray-500",
    },
    success: {
        box: "border-green-600 border-l-green-600 bg-green-200 text-gray-900",
        icon: "border-green-500 text-green-700",
    },
    danger: {
        box: "border-red-700 border-l-red-700 bg-red-300 text-gray-900",
        icon: "border-red-500 text-red-700",
    },
    warning: {
        box: "border-yellow-700 border-l-yellow-700 bg-yellow-200 text-gray-900",
        icon: "border-yellow-600 text-yellow-700",
    },
};

export default function AppAlert({
    message,
    variant = "default",
    onClose,
}: AppAlertProps) {
    const styles = alertStyles[variant];

    return (
        <motion.div
            className={`fixed left-1/2 top-6 z-[1000] flex w-[min(90vw,640px)] -translate-x-1/2 items-center justify-between rounded-md border-2 border-l-4 px-6 py-5 shadow-xl ${styles.box}`}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            <p className="text-base font-medium">
                {message}
            </p>

            <button
                type="button"
                onClick={onClose}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${styles.icon}`}
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
}