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
};

async function fetchPost(id: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PostDetail;
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
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-emerald-600">COMMUNITY</p>
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            게시글 수정
          </h1>
          <p className="text-sm leading-6 text-zinc-600 sm:text-base">
            내용을 업데이트한 뒤 저장하면 상세 페이지에서 바로 확인할 수 있습니다.
          </p>
        </header>

        <PostEditorForm
          apiBaseUrl={API_BASE_URL}
          mode="edit"
          postId={post.id}
          initialValues={{
            title: post.title,
            content: post.content,
            author: post.author,
            category: post.category,
          }}
        />
      </div>
    </div>
  );
}
