"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }), 
      });

      await refresh();
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900">
        เข้าสู่ระบบ
      </h1>
      <p className="mt-3 text-gray-600">
        เข้าสู่ระบบเพื่อดำเนินการสมัครใช้งาน EDC
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-900">
            Email Address / ที่อยู่อีเมล
          </label>
          <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2 focus-within:border-[#0A84E8] focus-within:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]">
            <Mail className="h-5 w-5 text-gray-900" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              className="w-full bg-transparent text-gray-900 outline-none"
              placeholder="somchai@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-900">
            Password / รหัสผ่าน
          </label>
          <div className="flex items-center gap-3 rounded-full border border-gray-900 bg-transparent px-4 py-2 focus-within:border-[#0A84E8] focus-within:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]">
            <Lock className="h-5 w-5 text-gray-900" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="w-full bg-transparent text-gray-900 outline-none"
              placeholder="กรอกรหัสผ่าน"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-gray-700 transition hover:text-[#0A84E8]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#0B6DDE] to-[#10AEE8] px-5 py-3 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "Sign In / เข้าสู่ระบบ"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-bold text-gray-900">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#0A84E8] hover:underline">
          Sign Up.
        </Link>
      </p>
    </div>
  );
}