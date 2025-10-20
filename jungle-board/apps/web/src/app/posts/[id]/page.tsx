import Link from "next/link";
import { notFound } from "next/navigation";
import CommentForm from "../../_components/comment-form";
import PostActions from "../../_components/post-actions";

const CATEGORY_STYLES: Record<string, string> = {
  공지: "bg-amber-100 text-amber-700",
  자유: "bg-sky-100 text-sky-700",
  "Q&A": "bg-indigo-100 text-indigo-700",
  정보: "bg-emerald-100 text-emerald-700",
};

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

type PostDetail = {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  views: number;
  comments: Comment[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function fetchPost(id: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PostDetail & {
      created_at?: string;
      createdAt?: string;
    };

    return {
      ...data,
      createdAt: data.createdAt ?? data.created_at ?? new Date().toISOString(),
      comments: (data.comments ?? []).map((comment) => ({
        ...comment,
        createdAt: comment.createdAt ?? new Date().toISOString(),
      })),
    } satisfies PostDetail;
  } catch (error) {
    console.error("Failed to load post", error);
    return null;
  }
}

function sortComments(comments: Comment[]) {
  return [...comments].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const post = await fetchPost(resolvedParams.id);

  if (!post) {
    notFound();
  }

  const comments = sortComments(post.comments ?? []);

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <Link
            href="/main-board"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-500"
          >
            ← 목록으로 돌아가기
          </Link>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-emerald-600">COMMUNITY</p>
            <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
              커뮤니티 게시판
            </h1>
            <p className="text-sm leading-6 text-zinc-600 sm:text-base">
              스터디원들과 지식을 나누고 도움을 주고받는 공간입니다. 게시글을 읽고
              자유롭게 의견을 남겨보세요.
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  CATEGORY_STYLES[post.category] ?? "bg-zinc-100 text-zinc-600"
                }`}
              >
                {post.category}
              </span>
              <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
                {post.title}
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-medium text-zinc-700">{post.author}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="text-zinc-300">•</span>
                  <span>조회수 {post.views.toLocaleString()}</span>
                  <span className="text-zinc-300">•</span>
                  <span>댓글 {comments.length}</span>
                </div>
                <PostActions postId={post.id} apiBaseUrl={API_BASE_URL} />
              </div>
            </div>

            <article className="prose prose-zinc max-w-none whitespace-pre-line text-base leading-7 text-zinc-700">
              {post.content}
            </article>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="text-lg font-semibold text-zinc-900">
              댓글 {comments.length}
            </h3>
            <span className="text-xs text-zinc-400">
              댓글은 최신 순으로 정렬됩니다.
            </span>
          </div>

          {comments.length ? (
            <ul className="flex flex-col gap-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                    <span className="text-sm font-semibold text-zinc-700">
                      {comment.author}
                    </span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-700">
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500">
              아직 작성된 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!
            </div>
          )}

          <CommentForm postId={post.id} apiBaseUrl={API_BASE_URL} />
        </section>
      </div>
    </div>
  );
}
