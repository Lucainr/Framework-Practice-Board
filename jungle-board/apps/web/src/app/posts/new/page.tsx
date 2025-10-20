import PostEditorForm from "../../_components/post-editor-form";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-emerald-600">COMMUNITY</p>
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            새 게시글 작성
          </h1>
          <p className="text-sm leading-6 text-zinc-600 sm:text-base">
            커뮤니티에 공유하고 싶은 내용을 자유롭게 작성해보세요.
          </p>
        </header>

        <PostEditorForm apiBaseUrl={API_BASE_URL} mode="create" />
      </div>
    </div>
  );
}
