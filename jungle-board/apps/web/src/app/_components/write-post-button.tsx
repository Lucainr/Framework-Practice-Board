"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAuth } from "../_hooks/use-auth";

type WritePostButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function WritePostButton({
  className,
  children = "글쓰기",
}: WritePostButtonProps) {
  const router = useRouter();
  const { auth } = useAuth();

  const handleClick = useCallback(() => {
    if (!auth?.token) {
      window.alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    router.push("/posts/new");
  }, [auth?.token, router]);

  const mergedClassName = className
    ? `primary-button ${className}`
    : "primary-button";

  return (
    <button type="button" onClick={handleClick} className={mergedClassName}>
      {children}
    </button>
  );
}
