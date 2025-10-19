"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const CATEGORIES = ["공지", "자유", "Q&A", "정보"] as const;

type FormState = {
  title: string;
  content: string;
  author: string;
  category: (typeof CATEGORIES)[number];
};

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    content: "",
    author: "",
    category: "공지",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.author.trim() || !form.content.trim()) {
      setError("제목, 작성자, 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          author: form.author.trim(),
          category: form.category,
          content: form.content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("게시글 저장에 실패했습니다.");
      }

      const post = (await response.json()) as { id: number };
      router.replace(`/posts/${post.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-emerald-600">COMMUNITY</p>
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            새 글 작성
          </h1>
          <p className="text-sm leading-6 text-zinc-600 sm:text-base">
            커뮤니티 구성원들과 공유하고 싶은 이야기를 작성해 주세요.
          </p>
        </header>

        <section className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700">제목</label>
              <input
                type="text"
                value={form.title}
                onChange={updateField("title")}
                placeholder="게시글 제목을 입력하세요"
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div className="flex-1">
                <label className="text-sm font-medium text-zinc-700">작성자</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={updateField("author")}
                  placeholder="이름 또는 닉네임"
                  className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-zinc-700">카테고리</label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value as FormState["category"],
                    }))
                  }
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
              <label className="text-sm font-medium text-zinc-700">내용</label>
              <textarea
                value={form.content}
                onChange={updateField("content")}
                placeholder="본문 내용을 작성해주세요."
                className="min-h-[260px] rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : null}

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
                {submitting ? "등록 중..." : "등록"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
