"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../_hooks/use-auth";

const HIDDEN_PATHS = new Set(["/", "/login", "/register"]);

function shouldHideHeader(pathname: string | null) {
  if (!pathname) {
    return true;
  }
  return HIDDEN_PATHS.has(pathname);
}

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, clearAuth } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const hidden = useMemo(() => shouldHideHeader(pathname), [pathname]);

  const handleLogout = useCallback(() => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    clearAuth();
    router.replace("/login");

    // allow navigation to settle before resetting state
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 150);
  }, [clearAuth, isLoggingOut, router]);

  if (hidden) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-[var(--background)] shadow-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-4 py-3 text-sm text-zinc-700 sm:px-6 lg:px-8 background-color:#f4f7f2">
        <Link
          href="/main-board"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:text-emerald-800"
        >
          <span className="text-xs uppercase tracking-[0.16em] text-emerald-500">
            Jungle
          </span>
          Board
        </Link>

        {auth ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-zinc-600 sm:inline">
              {auth.user.name}님
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-colors duration-200 hover:border-emerald-400 hover:bg-emerald-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Link
              href="/login"
              className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-500 px-4 py-2 text-white shadow-sm transition hover:bg-emerald-400"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
