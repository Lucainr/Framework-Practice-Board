import PostEditorForm from "../../_components/post-editor-form";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-8 fade-up">
      <header className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-9 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
        <span className="pill mb-3 inline-flex">Create</span>
        <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[38px]">
          새 게시글 작성
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">
          공유하고 싶은 정보를 작성하고 저장하면 커뮤니티 전체에 실시간으로 반영됩니다.
        </p>
      </header>

      <PostEditorForm apiBaseUrl={API_BASE_URL} mode="create" />
    </div>
  );
}
