export default function InfoBoardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
            Jungle Board
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">정보 게시판</h1>
          <p className="max-w-3xl text-base text-white/70">
            스터디 자료, 행사 일정, 유용한 링크 등 정보를 한 곳에서 찾고 공유하세요.
            정확한 출처 표기를 해주면 모두가 더 믿고 사용할 수 있어요.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm text-white/60">
            추후 카드형 또는 리스트형 UI로 자료를 분류할 수 있도록 모듈을 구성해
            보세요.
          </p>
        </section>
      </div>
    </div>
  );
}
