"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const COHORT_OPTIONS = Array.from({ length: 10 }, (_, index) => 5 + index);

type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  birthDate: string;
  phone: string;
  cohort: number | "";
  studentNumber: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  birthDate: "",
  phone: "",
  cohort: "",
  studentNumber: "",
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
      form.phone.trim().length >= 7 &&
      typeof form.cohort === "number" &&
      /^\d{2}$/.test(form.studentNumber.trim())
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
          cohort: form.cohort,
          studentNumber: form.studentNumber.trim(),
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

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-6 py-12 text-zinc-900">
      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-2xl transition-transform duration-300 ease-out">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              ✓
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">회원가입이 완료됐어요!</h2>
            <p className="text-sm text-zinc-500">
              잠시 후 로그인 화면으로 이동합니다.
            </p>
          </div>
        </div>
      ) : null}
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white shadow-xl">
        <div className="grid gap-10 p-10 md:grid-cols-[260px,1fr] md:items-start">
          <header className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Join the Community
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Jungle Board 회원가입
            </h1>
            <p className="text-sm leading-6 text-zinc-500">
              아래 정보를 입력하면 커뮤니티 활동을 시작할 수 있습니다.
            </p>
            <div className="space-y-2 text-xs text-zinc-400">
              <p>정확한 정보가 등록되어야 커뮤니티를 온전히 이용할 수 있어요.</p>
              <p>전화번호는 로그인 알림 및 계정 복구 용도로만 사용됩니다.</p>
            </div>
          </header>

          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="grid gap-y-10 gap-x-6 sm:grid-cols-2">
              <label className="flex flex-col gap-3 text-sm">
                <span className="font-medium text-zinc-700">이름</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  type="text"
                  className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="홍길동"
                />
              </label>
              <label className="flex flex-col gap-3 text-sm">
                <span className="font-medium text-zinc-700">이메일</span>
                <input
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  type="email"
                  className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="name@example.com"
                />
              </label>
              <label className="flex flex-col gap-3 text-sm">
                <span className="font-medium text-zinc-700">비밀번호</span>
                <input
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  type="password"
                  className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="8자 이상 입력해주세요"
                />
              </label>
              <label className="flex flex-col gap-3 text-sm">
                <span className="font-medium text-zinc-700">비밀번호 확인</span>
                <input
                  value={form.passwordConfirm}
                  onChange={(event) => updateField("passwordConfirm", event.target.value)}
                  type="password"
                  className={`rounded-xl border px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 ${
                    form.passwordConfirm
                      ? form.passwordConfirm.trim() === form.password.trim()
                        ? "border-emerald-400 bg-emerald-50/40 focus:border-emerald-500 focus:ring-emerald-100"
                        : "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
                      : "border-zinc-200 bg-zinc-50/80 focus:border-emerald-500 focus:bg-white focus:ring-emerald-100"
                  }`}
                  placeholder="비밀번호를 다시 입력해주세요"
                />
                {form.passwordConfirm ? (
                  <p
                    className={`text-xs font-medium ${
                      form.passwordConfirm.trim() === form.password.trim()
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {form.passwordConfirm.trim() === form.password.trim()
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."}
                  </p>
                ) : null}
              </label>
              <label className="flex flex-col gap-3 text-sm">
                <span className="font-medium text-zinc-700">생년월일</span>
                <input
                  value={form.birthDate}
                  onChange={(event) => updateField("birthDate", event.target.value)}
                  type="date"
                  className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              <label className="flex flex-col gap-3 text-sm">
                <span className="font-medium text-zinc-700">전화번호</span>
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  type="tel"
                  className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="010-0000-0000"
                />
              </label>
              <label className="flex flex-col gap-3 text-sm">
                <span className="font-medium text-zinc-700">정글 기수</span>
                <select
                  value={form.cohort}
                  onChange={(event) =>
                    updateField(
                      "cohort",
                      event.target.value ? Number.parseInt(event.target.value, 10) : "",
                    )
                  }
                  className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">기수를 선택하세요</option>
                  {COHORT_OPTIONS.map((cohort) => (
                    <option key={cohort} value={cohort}>
                      {cohort}기
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-3 text-sm sm:col-span-2">
                <span className="font-medium text-zinc-700">정글 교육생 번호</span>
                <input
                  value={form.studentNumber}
                  onChange={(event) => updateField("studentNumber", event.target.value)}
                  type="text"
                  className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="예 : 01"
                />
              </label>
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-400">
                회원가입 시 커뮤니티 이용 약관과 개인정보 처리방침에 동의하게 됩니다.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {submitting ? "가입 중..." : "회원가입"}
              </button>
            </div>
            <p className="text-center text-xs text-zinc-500">
              이미 계정이 있으신가요? {" "}
              <button
                type="button"
                onClick={() => router.replace("/login")}
                className="font-semibold text-emerald-600 hover:text-emerald-500"
              >
                로그인 하러가기
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
