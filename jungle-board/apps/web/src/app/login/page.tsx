export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">정글 보드 로그인</h1>
          <p className="text-sm text-white/60">
            계정으로 로그인하고 커뮤니티 활동을 시작하세요.
          </p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
              placeholder="영문, 숫자, 특수문자 포함"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-400/90 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
          >
            로그인
          </button>
        </form>

        <div className="text-center text-xs text-white/50">
          아직 계정이 없나요? 회원가입은 운영진에게 문의해 주세요.
        </div>
      </div>
    </div>
  );
}
