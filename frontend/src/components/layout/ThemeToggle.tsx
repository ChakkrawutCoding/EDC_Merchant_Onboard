"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex h-10 w-10 items-center justify-center rounded-full border-4 transition duration-500 ${
                isDark
                    ? "border-gray-600 bg-gradient-to-br from-[#4F5058] to-[#31333C] text-gray-200"
                    : "border-blue-200 bg-gradient-to-br from-[#035FC8] to-[#00A0E6] text-white"
            }`}
        >
            {isDark ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
        </button>
    );
}