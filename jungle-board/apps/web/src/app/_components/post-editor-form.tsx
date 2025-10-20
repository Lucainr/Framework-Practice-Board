"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["공지", "자유", "Q&A", "정보"] as const;

type PostEditorFormProps = {
  apiBaseUrl: string;
  mode: "create" | "edit";
  postId?: number;
  initialValues?: {
    title: string;
    content: string;
    author: string;
    category: string;
  };
};

type FormState = {
  title: string;
  content: string;
  author: string;
  category: (typeof CATEGORIES)[number];
};

const EMPTY_FORM: FormState = {
  title: "",
  content: "",
  author: "",
  category: "공지",
};

function normalizeCategory(value?: string): FormState["category"] {
  if (!value) {
    return "공지";
  }

  return (CATEGORIES.find((category) => category === value) ?? "공지");
}

export default function PostEditorForm({
  apiBaseUrl,
  mode,
  postId,
  initialValues,
}: PostEditorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    initialValues
      ? {
          title: initialValues.title,
          content: initialValues.content,
          author: initialValues.author,
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
        author: initialValues.author,
        category: normalizeCategory(initialValues.category),
      });
    }
  }, [initialValues]);

  const updateField = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]:
          field === "category"
            ? (value as FormState["category"])
            : value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.author.trim() || !form.content.trim()) {
      setError("제목, 작성자, 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
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
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("게시글 저장에 실패했습니다.");
      }

      const data = (await response.json()) as { id: number };
      router.replace(`/posts/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={updateField("title")}
            placeholder="게시글 제목을 입력하세요"
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-zinc-700" htmlFor="author">
              작성자
            </label>
            <input
              id="author"
              type="text"
              value={form.author}
              onChange={updateField("author")}
              placeholder="이름 또는 닉네임"
              className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-zinc-700" htmlFor="category">
              카테고리
            </label>
            <select
              id="category"
              value={form.category}
              onChange={updateField("category")}
              className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
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
          <label className="text-sm font-medium text-zinc-700" htmlFor="content">
            내용
          </label>
          <textarea
            id="content"
            value={form.content}
            onChange={updateField("content")}
            placeholder="본문 내용을 작성해주세요."
            className="min-h-[260px] rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {submitting ? "처리 중..." : mode === "edit" ? "수정 완료" : "등록"}
          </button>
        </div>
      </form>
    </section>
  );
}
