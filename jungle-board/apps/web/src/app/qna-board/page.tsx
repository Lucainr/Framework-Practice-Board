export default function QnaBoardPage() {
  return (
    <div className="flex flex-col gap-8 fade-up">
      <header className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-9 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
        <span className="pill mb-3 inline-flex">Q&amp;A</span>
        <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[38px]">
          지식 Q&amp;A
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          기술, 커리어, 프로젝트에 대한 질문을 올리고 답변을 받아보세요. 좋은 질문과 답변은 커뮤니티를 더 똑똑하게 만듭니다.
        </p>
      </header>

      <section className="fade-up fade-delay-1 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-7 py-8 text-sm text-[var(--muted)] shadow-[0_12px_32px_rgba(12,36,70,0.06)]">
        추후 Q&amp;A 목록과 필터, 답변 상태를 표시할 수 있도록 UI 컴포넌트를 배치해 주세요.
      </section>
    </div>
  );
}
