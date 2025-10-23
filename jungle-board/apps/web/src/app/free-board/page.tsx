export default function FreeBoardPage() {
  return (
    <div className="flex flex-col gap-8 fade-up">
      <header className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-9 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
        <span className="pill mb-3 inline-flex">Free Board</span>
        <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[38px]">
          자유 게시판
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          일상 이야기부터 최신 밈까지 자유롭게 나눠보세요. 서로의 생각과 경험을 공유하며 커뮤니티를 더 즐겁게 만들어 보아요.
        </p>
      </header>

      <section className="fade-up fade-delay-1 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-7 py-8 text-sm text-[var(--muted)] shadow-[0_12px_32px_rgba(12,36,70,0.06)]">
        이 영역에 자유 게시판 리스트 컴포넌트를 렌더링할 수 있도록 구성하세요. API 응답 형태에 맞춰 카드나 테이블 UI를 추가하면 좋습니다.
      </section>
    </div>
  );
}
