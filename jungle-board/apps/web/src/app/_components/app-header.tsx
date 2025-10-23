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
  const navItems = useMemo(
    () => [
      { href: "/main-board", label: "커뮤니티" },
      { href: "/notice-board", label: "공지" },
      { href: "/info-board", label: "정보" },
      { href: "/free-board", label: "자유" },
      { href: "/qna-board", label: "Q&A" },
    ],
    [],
  );

  const hidden = useMemo(() => shouldHideHeader(pathname), [pathname]);

  const handleLogout = useCallback(() => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    clearAuth();
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 150);
  }, [clearAuth, isLoggingOut]);

  if (hidden) {
    return null;
  }

  return (
    <header className="sticky top-6 z-50 w-full fade-down">
      <div className="flex items-center justify-between rounded-[28px] border border-[rgba(226,230,240,0.7)] bg-[rgba(255,255,255,0.82)] px-6 py-4 shadow-[0_20px_52px_rgba(31,41,55,0.12)] backdrop-blur-xl">
        <Link href="/main-board" className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            Wook Board
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)] sm:inline">
            Community
          </span>
        </Link>

        {auth ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-[var(--muted)] sm:inline">
              {auth.user.name}님
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-full border border-[rgba(210,214,224,0.7)] bg-[rgba(244,244,247,0.85)] px-4 py-[0.55rem] text-sm font-medium text-[var(--foreground)] transition hover:bg-[rgba(233,234,240,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-full border border-[rgba(210,214,224,0.7)] bg-[rgba(244,244,247,0.85)] px-4 py-[0.55rem] font-medium text-[var(--foreground)] transition hover:bg-[rgba(233,234,240,0.95)]"
            >
              로그인
            </Link>
            <Link href="/register" className="primary-button px-5 py-2">
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
