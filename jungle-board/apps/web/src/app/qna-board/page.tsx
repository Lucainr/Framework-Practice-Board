export default function QnaBoardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
            Jungle Board
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">지식 Q&amp;A</h1>
          <p className="max-w-3xl text-base text-white/70">
            기술, 커리어, 프로젝트에 대한 질문을 올리고 답변을 받아보세요. 좋은 질문과
            답변은 커뮤니티를 더 똑똑하게 만듭니다.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm text-white/60">
            추후 Q&amp;A 목록과 필터, 답변 상태를 표시할 수 있도록 UI 컴포넌트를
            배치해 주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
