export default function NoticeBoardPage() {
  return (
    <div className="flex flex-col gap-8 fade-up">
      <header className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-9 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
        <span className="pill mb-3 inline-flex">Notice</span>
        <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[38px]">
          공지사항
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          커뮤니티 운영진의 안내와 정책 변경, 이벤트 소식을 빠르게 확인하세요. 중요한 내용은 즐겨찾기에 고정해두면 더욱 편리합니다.
        </p>
      </header>

      <section className="fade-up fade-delay-1 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-7 py-8 text-sm text-[var(--muted)] shadow-[0_12px_32px_rgba(12,36,70,0.06)]">
        추후 공지 목록과 고정 공지를 API와 연결해 표현해주세요.
      </section>
    </div>
  );
}
