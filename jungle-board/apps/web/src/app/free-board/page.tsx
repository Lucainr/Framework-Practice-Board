export default function FreeBoardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
            Jungle Board
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">자유 게시판</h1>
          <p className="max-w-3xl text-base text-white/70">
            일상 이야기부터 최신 밈까지 자유롭게 나눠보세요. 서로의 생각과 경험을
            공유하며 커뮤니티를 더 즐겁게 만들어 보아요.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm text-white/60">
            이 영역에 자유 게시판 리스트 컴포넌트를 렌더링할 수 있도록 구성하세요.
            API 응답 형태에 맞춰 카드나 테이블 UI를 추가하면 좋습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
