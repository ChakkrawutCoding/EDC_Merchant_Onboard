"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { MailCheck } from "lucide-react";

import { apiRequest } from "@/lib/api";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await apiRequest("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
        }),
      });

      router.push("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Email verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setResending(true);

    try {
      await apiRequest("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setMessage("ส่งรหัสยืนยันใหม่แล้ว กรุณาตรวจสอบอีเมล");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend code");
    } finally {
      setResending(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
        <MailCheck className="h-7 w-7" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900">
        ยืนยันอีเมล
      </h1>

      <p className="mt-3 text-gray-600">
        เราได้ส่งรหัสยืนยันไปที่{" "}
        <span className="font-semibold text-gray-900">
          {email || "อีเมลของคุณ"}
        </span>
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-900">
            Verification Code / รหัสยืนยัน
          </label>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            className="w-full rounded-full border border-gray-900 bg-transparent px-5 py-3 text-center text-2xl font-bold tracking-[0.35em] text-gray-900 outline-none focus:border-[#0A84E8] focus:shadow-[0_0_0_3px_rgba(10,132,232,0.18)]"
            placeholder="000000"
            inputMode="numeric"
            maxLength={6}
            required
          />
        </div>

        {message && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email || code.length !== 6}
          className="w-full rounded-full bg-gradient-to-r from-[#0B6DDE] to-[#10AEE8] px-5 py-3 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "กำลังยืนยัน..." : "Verify Email / ยืนยันอีเมล"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending || !email}
          className="text-sm font-bold text-[#0A84E8] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending ? "กำลังส่งรหัสใหม่..." : "ส่งรหัสยืนยันอีกครั้ง"}
        </button>
      </div>

      <p className="mt-8 text-center text-sm font-bold text-gray-900">
        กลับไปหน้า{" "}
        <Link href="/register" className="text-[#0A84E8] hover:underline">
          ลงทะเบียน
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}