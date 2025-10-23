"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../_hooks/use-auth";

type PostActionsProps = {
  postId: number;
  apiBaseUrl: string;
  authorId: number | null;
};

export default function PostActions({ postId, apiBaseUrl, authorId }: PostActionsProps) {
  const router = useRouter();
  const { auth } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) {
      return;
    }

    if (!auth?.token || auth.user.id !== authorId || authorId === null) {
      // eslint-disable-next-line no-alert
      alert("본인 게시글만 삭제할 수 있습니다.");
      return;
    }

    const confirmed = window.confirm("정말로 이 게시글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "게시글 삭제에 실패했습니다.");
      }

      router.replace("/main-board");
      router.refresh();
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (!auth?.token || authorId === null || auth.user.id !== authorId) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/posts/${postId}/edit`}
        className="rounded-full border border-[rgba(226,230,240,0.8)] bg-[rgba(244,244,247,0.9)] px-5 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[rgba(233,234,240,0.95)]"
      >
        수정
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center rounded-full border border-[rgba(248,113,113,0.4)] bg-[#fff5f5] px-5 py-2 text-sm font-medium text-[#e11d48] transition hover:border-[rgba(248,113,113,0.6)] hover:bg-[#ffe5e9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? "삭제 중..." : "삭제"}
      </button>
    </div>
  );
}
