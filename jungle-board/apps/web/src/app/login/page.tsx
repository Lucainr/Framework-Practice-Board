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

  const inputClass = (base: string) =>
    `${base} ${
      error
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-zinc-200 focus:border-emerald-500 focus:ring-emerald-100"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-zinc-900">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-200 bg-white p-10 shadow-xl">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Jungle Board 로그인
          </h1>
          <p className="text-sm text-zinc-500">
            계정으로 로그인하고 커뮤니티 활동을 시작하세요.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            className={inputClass(
              "w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2",
            )}
            placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            className={inputClass(
              "w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2",
            )}
            placeholder="영문, 숫자, 특수문자 포함"
          />
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : null}
        </div>
        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500">
          아직 계정이 없나요? {" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-500"
          >
            회원가입 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
