"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  birthDate: string;
  phone: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  birthDate: "",
  phone: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const isValid = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      /.+@.+\..+/.test(form.email.trim()) &&
      form.password.trim().length >= 8 &&
      form.password.trim() === form.passwordConfirm.trim() &&
      Boolean(form.birthDate) &&
      form.phone.trim().length >= 7
    );
  }, [form]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setError("모든 정보를 정확히 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          birthDate: form.birthDate,
          phone: form.phone.trim(),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "회원가입에 실패했습니다.");
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(118,125,139,0.45)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(10,132,255,0.18)]";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] w-full max-w-[1120px] items-center px-4 text-[var(--foreground)] sm:px-6 fade-up">
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,32,43,0.45)] backdrop-blur">
          <div className="panel flex w-full max-w-sm flex-col items-center gap-4 rounded-[28px] px-10 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(10,132,255,0.12)] text-2xl text-[var(--accent-primary)]">
              ✓
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">회원가입이 완료됐어요!</h2>
            <p className="text-sm text-[var(--muted)]">
              잠시 후 로그인 화면으로 이동합니다.
            </p>
          </div>
        </div>
      ) : null}
      <div className="panel grid w-full gap-12 px-10 py-12 sm:px-14 md:grid-cols-[300px,1fr] md:items-start">
        <header className="space-y-5 fade-up">
          <span className="pill w-fit">Sign Up</span>
          <h1 className="text-3xl font-semibold leading-tight sm:text-[38px]">
            Wook Board에 합류하세요
          </h1>
          <p className="text-sm leading-6 text-[var(--muted)]">
            절제된 색감과 감각적인 인터랙션이 돋보이는 Wook 커뮤니티. 공지, 자유, Q&amp;A, 정보 게시판을 하나의 정갈한 환경에서 누려보세요.
          </p>
          <div className="space-y-2 rounded-2xl border border-[rgba(226,230,240,0.8)] bg-[rgba(244,244,247,0.75)] px-5 py-4 text-xs text-[rgba(118,125,139,0.75)]">
            <p>· 정확한 정보 입력 시 계정 안정성과 접근 권한이 유지됩니다.</p>
            <p>· 전화번호는 알림 및 계정 복구 목적 외에는 사용하지 않습니다.</p>
          </div>
        </header>

        <form className="fade-up fade-delay-1 flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="grid gap-y-8 gap-x-6 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span>이름</span>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                type="text"
                className={inputClass}
                placeholder="홍길동"
                autoComplete="name"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span>이메일</span>
              <input
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                type="email"
                className={inputClass}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span>비밀번호</span>
              <input
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                type="password"
                className={inputClass}
                placeholder="8자 이상 입력해주세요"
                autoComplete="new-password"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span>비밀번호 확인</span>
              <input
                value={form.passwordConfirm}
                onChange={(event) => updateField("passwordConfirm", event.target.value)}
                type="password"
                className={`${inputClass} ${
                  form.passwordConfirm
                    ? form.passwordConfirm.trim() === form.password.trim()
                      ? "border-[rgba(10,132,255,0.45)] bg-[rgba(10,132,255,0.08)]"
                      : "border-[rgba(251,113,133,0.6)] bg-[#fff5f5]"
                    : ""
                }`}
                placeholder="비밀번호를 다시 입력해주세요"
                autoComplete="new-password"
              />
              {form.passwordConfirm ? (
                <p
                  className={`text-xs font-medium ${
                    form.passwordConfirm.trim() === form.password.trim()
                      ? "text-[var(--accent-primary)]"
                      : "text-[#f87171]"
                  }`}
                >
                  {form.passwordConfirm.trim() === form.password.trim()
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."}
                </p>
              ) : null}
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span>생년월일</span>
              <input
                value={form.birthDate}
                onChange={(event) => updateField("birthDate", event.target.value)}
                type="date"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span>전화번호</span>
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                type="tel"
                className={inputClass}
                placeholder="010-0000-0000"
                autoComplete="tel"
              />
            </label>
          </div>

          {error ? (
            <p className="rounded-2xl border border-[rgba(251,113,133,0.6)] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#f87171]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(226,230,240,0.8)] bg-[rgba(244,244,247,0.85)] px-5 py-4 text-xs text-[rgba(118,125,139,0.75)] sm:flex-row sm:items-center sm:justify-between">
            <p>회원가입 시 커뮤니티 이용 약관과 개인정보 처리방침에 동의하게 됩니다.</p>
            <button
              type="submit"
              disabled={submitting}
              className="primary-button px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "가입 중..." : "회원가입"}
            </button>
          </div>
          <p className="text-center text-xs text-[var(--muted)]">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="font-semibold text-[var(--accent-primary)] hover:text-[#056de1]"
            >
              로그인 하러가기
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
