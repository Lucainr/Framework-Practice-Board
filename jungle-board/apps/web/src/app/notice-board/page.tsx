export default function NoticeBoardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
            Jungle Board
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">공지사항</h1>
          <p className="max-w-3xl text-base text-white/70">
            커뮤니티 운영진의 공식 안내와 정책 변경, 이벤트 알림을 확인하세요.
            중요한 정보는 알림 설정을 통해 놓치지 마세요.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm text-white/60">
            추후 공지 사항 목록과 세부 내용을 API와 연결해 표시하세요. 고정 공지는
            상단에 고정하는 UI를 추천합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
