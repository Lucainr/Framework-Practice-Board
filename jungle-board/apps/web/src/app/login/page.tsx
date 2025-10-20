export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 text-zinc-900">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-200 bg-white p-10 shadow-xl">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Jungle Board 로그인
          </h1>
          <p className="text-sm text-zinc-500">
            계정으로 로그인하고 커뮤니티 활동을 시작하세요.
          </p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="영문, 숫자, 특수문자 포함"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            로그인
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500">
          아직 계정이 없나요? 회원가입은 운영진에게 문의해 주세요.
        </div>
      </div>
    </div>
  );
}
