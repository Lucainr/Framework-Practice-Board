export default function InfoBoardPage() {
  return (
    <div className="flex flex-col gap-8 fade-up">
      <header className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-9 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
        <span className="pill mb-3 inline-flex">Info</span>
        <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[38px]">
          정보 게시판
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          스터디 자료, 행사 일정, 유용한 링크 등 정보를 한 곳에서 정리하세요. 정확한 출처와 함께 기록하면 모두가 더 믿고 사용할 수 있어요.
        </p>
      </header>

      <section className="fade-up fade-delay-1 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-7 py-8 text-sm text-[var(--muted)] shadow-[0_12px_32px_rgba(12,36,70,0.06)]">
        추후 카드형 또는 리스트형 UI로 자료를 정돈할 수 있도록 컴포넌트를 배치해 보세요.
      </section>
    </div>
  );
}
