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
        className="inline-flex items-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
      >
        수정
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {deleting ? "삭제 중..." : "삭제"}
      </button>
    </div>
  );
}
