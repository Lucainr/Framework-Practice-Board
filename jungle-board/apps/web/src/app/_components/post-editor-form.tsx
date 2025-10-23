"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/use-auth";

const CATEGORIES = ["공지", "자유", "Q&A", "정보"] as const;

type PostEditorFormProps = {
  apiBaseUrl: string;
  mode: "create" | "edit";
  postId?: number;
  initialValues?: {
    title: string;
    content: string;
    category: string;
    authorId?: number | null;
    authorName?: string;
  };
};

type FormState = {
  title: string;
  content: string;
  category: (typeof CATEGORIES)[number];
};

const EMPTY_FORM: FormState = {
  title: "",
  content: "",
  category: "공지",
};

function normalizeCategory(value?: string): FormState["category"] {
  if (!value) {
    return "공지";
  }

  return CATEGORIES.find((category) => category === value) ?? "공지";
}

export default function PostEditorForm({
  apiBaseUrl,
  mode,
  postId,
  initialValues,
}: PostEditorFormProps) {
  const router = useRouter();
  const { auth } = useAuth();
  const [form, setForm] = useState<FormState>(
    initialValues
      ? {
          title: initialValues.title,
          content: initialValues.content,
          category: normalizeCategory(initialValues.category),
        }
      : EMPTY_FORM,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setForm({
        title: initialValues.title,
        content: initialValues.content,
        category: normalizeCategory(initialValues.category),
      });
    }
  }, [initialValues]);

  const updateField =
    (field: keyof FormState) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = event.target.value;
        setError(null);
        setForm((prev) => ({
          ...prev,
          [field]:
            field === "category"
              ? (value as FormState["category"])
              : value,
        }));
      };

  const authorName = auth?.user.name ?? initialValues?.authorName ?? "";
  const authorId = initialValues?.authorId ?? null;
  const isEditing = mode === "edit";
  const isAuthenticated = Boolean(auth?.token);
  const isAuthor =
    !isEditing || authorId === null || (auth?.user.id === authorId && isAuthenticated);
  const canSubmit = isAuthenticated && isAuthor;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth?.token) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (!isAuthor) {
      setError("본인 게시글만 수정할 수 있습니다.");
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      content: form.content.trim(),
    };

    const isEdit = mode === "edit" && postId !== undefined;
    const endpoint = isEdit
      ? `${apiBaseUrl}/posts/${postId}`
      : `${apiBaseUrl}/posts`;

    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "게시글 저장에 실패했습니다.");
      }

      const data = (await response.json()) as { id: number };
      router.replace(`/posts/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel fade-up flex flex-col gap-8 px-8 py-9">
      {!isAuthenticated ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-medium text-[var(--foreground)]">
          게시글을 작성하거나 수정하려면 먼저 로그인해주세요.
        </div>
      ) : null}
      {isEditing && isAuthenticated && !isAuthor ? (
        <div className="rounded-xl border border-[rgba(248,113,113,0.5)] bg-[#fff5f5] px-4 py-3 text-sm text-[#e11d48]">
          본인 게시글만 수정할 수 있습니다.
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={updateField("title")}
            placeholder="게시글 제목을 입력하세요"
            disabled={!canSubmit}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(118,125,139,0.45)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(10,132,255,0.18)] disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[rgba(118,125,139,0.6)]"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <span className="text-sm font-medium text-[var(--foreground)]">작성자</span>
            <div className="mt-2 rounded-2xl border border-[rgba(226,230,240,0.8)] bg-[rgba(244,244,247,0.75)] px-4 py-3 text-sm font-semibold text-[var(--foreground)]">
              {authorName || "로그인 필요"}
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="category">
              카테고리
            </label>
            <select
              id="category"
              value={form.category}
              onChange={updateField("category")}
              disabled={!canSubmit}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(10,132,255,0.18)] disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[rgba(118,125,139,0.6)]"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="content">
            내용
          </label>
          <textarea
            id="content"
            value={form.content}
            onChange={updateField("content")}
            placeholder="본문 내용을 작성해주세요."
            disabled={!canSubmit}
            className="min-h-[260px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm leading-7 text-[var(--foreground)] placeholder:text-[rgba(118,125,139,0.45)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(10,132,255,0.18)] disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[rgba(118,125,139,0.6)]"
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-[rgba(251,113,133,0.6)] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#e11d48]">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-[rgba(210,214,224,0.8)] bg-[rgba(244,244,247,0.9)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[rgba(233,234,240,0.95)] sm:w-auto"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="primary-button w-full justify-center px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "처리 중..." : mode === "edit" ? "수정 완료" : "등록"}
          </button>
        </div>
      </form>
    </section>
  );
}
