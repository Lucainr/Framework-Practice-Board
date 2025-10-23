"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/use-auth";

type CommentFormProps = {
  postId: number;
  apiBaseUrl: string;
};

export default function CommentForm({ postId, apiBaseUrl }: CommentFormProps) {
  const router = useRouter();
  const { auth } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth?.token) {
      window.alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!content.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "댓글 저장에 실패했습니다.");
      }

      setContent("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fade-up flex flex-col gap-6 rounded-[26px] border border-[var(--border)] bg-[var(--surface)] px-7 py-7 shadow-[0_18px_40px_rgba(20,50,93,0.12)]"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">댓글 남기기</h3>
        <p className="text-xs text-[var(--muted)]">
          자유롭게 의견을 남겨주세요. 운영 정책에 맞지 않는 댓글은 예고 없이 수정 또는 삭제될 수 있어요.
        </p>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-[rgba(226,230,240,0.8)] bg-[rgba(244,244,247,0.75)] px-5 py-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium text-[var(--foreground)]">
          작성자: {auth ? auth.user.name : "로그인이 필요합니다"}
        </span>
        <span className="text-xs text-[rgba(118,125,139,0.7)]">
          로그인한 계정으로 댓글이 등록됩니다.
        </span>
      </div>
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          setError(null);
        }}
        placeholder="댓글 내용을 작성해주세요."
        className="h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] placeholder:text-[rgba(118,125,139,0.45)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(10,132,255,0.18)]"
        disabled={!auth?.token}
      />
      {error ? (
        <p className="rounded-xl border border-[rgba(248,113,113,0.5)] bg-[#fff5f5] px-4 py-2 text-sm font-medium text-[#e11d48]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[rgba(118,125,139,0.7)]">
          * 로그인 후 댓글을 작성할 수 있습니다.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="primary-button inline-flex items-center justify-center px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "작성 중..." : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}
