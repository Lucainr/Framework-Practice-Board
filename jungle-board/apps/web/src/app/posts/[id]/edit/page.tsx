import { notFound } from "next/navigation";
import PostEditorForm from "../../../_components/post-editor-form";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type PostDetail = {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  authorId: number | null;
};

async function fetchPost(id: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PostDetail & { authorId?: number | null };

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      author: data.author,
      authorId: data.authorId ?? null,
    };
  } catch (error) {
    console.error("Failed to load post", error);
    return null;
  }
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const post = await fetchPost(resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 fade-up">
      <header className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-9 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
        <span className="pill mb-3 inline-flex">Edit</span>
        <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[38px]">
          게시글 수정
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">
          내용을 업데이트하고 저장하면 즉시 상세 화면에 반영됩니다.
        </p>
      </header>

      <PostEditorForm
        apiBaseUrl={API_BASE_URL}
        mode="edit"
        postId={post.id}
        initialValues={{
          title: post.title,
          content: post.content,
          category: post.category,
          authorId: post.authorId,
          authorName: post.author,
        }}
      />
    </div>
  );
}
