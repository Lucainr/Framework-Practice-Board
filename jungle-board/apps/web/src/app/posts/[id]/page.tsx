import Link from "next/link";
import { notFound } from "next/navigation";
import CommentForm from "../../_components/comment-form";
import PostActions from "../../_components/post-actions";

const CATEGORY_STYLES: Record<string, string> = {
  공지:
    "border border-[rgba(10,132,255,0.25)] bg-[rgba(10,132,255,0.08)] text-[#0a84ff]",
  자유:
    "border border-[rgba(142,142,147,0.28)] bg-[rgba(242,242,247,0.8)] text-[#3a3a3c]",
  "Q&A":
    "border border-[rgba(94,92,230,0.25)] bg-[rgba(94,92,230,0.08)] text-[#5e5ce6]",
  정보:
    "border border-[rgba(52,199,89,0.25)] bg-[rgba(52,199,89,0.08)] text-[#34c759]",
};

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  authorId: number | null;
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
  authorId: number | null;
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
      authorId: data.authorId ?? null,
      createdAt: data.createdAt ?? data.created_at ?? new Date().toISOString(),
      comments: (data.comments ?? []).map((comment) => ({
        ...comment,
        authorId: comment.authorId ?? null,
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
    <div className="flex flex-col gap-10 fade-up">
      <header className="flex flex-col gap-4">
        <Link
          href="/main-board"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          ← 목록으로 돌아가기
        </Link>
        <div className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-9 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
          <span className="pill mb-3 inline-flex">Community</span>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[40px]">
            커뮤니티 게시판
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">
            정갈한 화면 위에서 스터디원의 기록을 살펴보고, 필요한 의견을 조용히 남겨보세요.
          </p>
        </div>
      </header>

      <section className="fade-up fade-delay-1 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] px-10 py-10 shadow-[0_18px_45px_rgba(12,36,70,0.08)] sm:px-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span
              className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-medium ${
                CATEGORY_STYLES[post.category] ??
                "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]"
              }`}
            >
              {post.category}
            </span>
            <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[38px]">
              {post.title}
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[rgba(91,100,116,0.75)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[var(--foreground)]">{post.author}</span>
                <span>{formatDate(post.createdAt)}</span>
                <span>조회 {post.views.toLocaleString()}</span>
                <span>댓글 {comments.length}</span>
              </div>
              <PostActions postId={post.id} authorId={post.authorId} apiBaseUrl={API_BASE_URL} />
            </div>
          </div>

          <article className="prose prose-neutral max-w-none whitespace-pre-wrap text-base leading-7 text-[var(--foreground)]">
            {post.content}
          </article>
        </div>
      </section>

      <section className="fade-up fade-delay-2 flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            댓글 {comments.length}
          </h3>
          <span className="text-xs text-[rgba(91,100,116,0.6)]">
            댓글은 최신 순으로 정렬됩니다.
          </span>
        </div>

        {comments.length ? (
          <ul className="flex flex-col gap-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-6 py-6 shadow-[0_10px_28px_rgba(12,36,70,0.05)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[rgba(91,100,116,0.65)] sm:text-sm">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {comment.author}
                  </span>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">
                  {comment.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-8 text-sm text-[var(--muted)]">
            아직 작성된 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!
          </div>
        )}

        <CommentForm postId={post.id} apiBaseUrl={API_BASE_URL} />
      </section>
    </div>
  );
}
