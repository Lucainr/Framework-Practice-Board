"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/use-auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "로그인에 실패했습니다.");
      }

      const data = (await response.json()) as {
        accessToken?: string;
        user?: { id: number; email: string; name: string };
      };

      if (!data.accessToken || !data.user) {
        throw new Error("로그인 응답이 올바르지 않습니다.");
      }

      setAuth({
        token: data.accessToken,
        user: data.user,
      });
      router.replace("/main-board");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    [
      "w-full rounded-2xl border px-4 py-3 text-sm leading-6 text-[var(--foreground)] placeholder:text-[rgba(118,125,139,0.45)] transition focus:outline-none focus:ring-2",
      hasError
        ? "border-[rgba(251,113,133,0.6)] bg-[#fff5f5] focus:border-[#f87171] focus:ring-[rgba(248,113,113,0.2)]"
        : "border-[var(--border)] bg-[var(--surface)] focus:border-[var(--accent-primary)] focus:ring-[rgba(10,132,255,0.18)]",
    ].join(" ");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] w-full max-w-[980px] items-center fade-up">
      <div className="panel grid w-full gap-12 px-10 py-12 sm:px-14 md:grid-cols-[1.1fr,0.9fr]">
        <div className="flex flex-col justify-between gap-10 fade-up">
          <div className="flex flex-col gap-5">
            <span className="pill w-fit">Sign In</span>
            <h1 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--foreground)] sm:text-[42px]">
              섬세하게 다듬어진
              <br />
              Wook Board 경험
            </h1>
            <p className="text-base leading-relaxed text-[var(--muted)]">
              조용한 색채와 견고한 인터랙션. 공지, 정보, Q&amp;A를 Apple Store처럼 깔끔한 레이아웃에서 만나보세요.
            </p>
          </div>
          <ul className="grid gap-3 text-sm text-[var(--muted)]">
            <li>· 간결한 카드 뷰로 중요한 소식만 집중</li>
            <li>· 계정 연동으로 디바이스를 오가며 자연스럽게 이어보기</li>
          </ul>
        </div>
        <div className="fade-up fade-delay-1 flex flex-col gap-8 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-8 py-10 shadow-[0_22px_42px_rgba(20,50,93,0.14)]">
          <header className="space-y-2 text-left">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">로그인</h2>
            <p className="text-sm text-[var(--muted)]">Wook 계정 정보를 입력해주세요.</p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]" htmlFor="email">
              이메일
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                className={inputClass(Boolean(error))}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]" htmlFor="password">
              비밀번호
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                }}
                className={inputClass(Boolean(error))}
                placeholder="영문, 숫자, 특수문자 포함"
                autoComplete="current-password"
              />
            </label>
            {error ? (
              <p className="rounded-xl border border-[rgba(251,113,133,0.6)] bg-[#fff5f5] px-4 py-2 text-xs font-medium text-[#f87171]">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="rounded-2xl border border-[rgba(226,230,240,0.7)] bg-[rgba(244,244,247,0.85)] px-6 py-5 text-sm text-[var(--muted)]">
            아직 계정이 없나요?{" "}
            <Link href="/register" className="font-semibold text-[var(--accent-primary)] hover:text-[#056de1]">
              회원가입 하러가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
