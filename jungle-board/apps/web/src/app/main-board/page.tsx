import BoardSearchBar from "../_components/board-search-bar";

type Post = {
  id: number;
  number?: number;
  category: "공지" | "자유" | "Q&A" | "정보";
  title: string;
  author: string;
  date: string;
  views: number;
  comments?: number;
  pinned?: boolean;
  isNew?: boolean;
};

const boardCategories = ["전체", "공지", "자유", "Q&A", "정보"] as const;

const categoryStyles: Record<Post["category"], string> = {
  공지: "bg-amber-100 text-amber-700",
  자유: "bg-sky-100 text-sky-700",
  "Q&A": "bg-indigo-100 text-indigo-700",
  정보: "bg-emerald-100 text-emerald-700",
};

const posts: Post[] = [
  {
    id: 0,
    pinned: true,
    category: "공지",
    title: "커뮤니티 이용 가이드와 운영 원칙 안내",
    author: "운영자",
    date: "2024.07.01",
    views: 1290,
  },
  {
    id: 1,
    number: 8,
    category: "자유",
    title: "첫 인사 드립니다! : )",
    author: "김민수",
    date: "2024.07.09",
    views: 214,
    comments: 6,
    isNew: true,
  },
  {
    id: 2,
    number: 7,
    category: "Q&A",
    title: "Next.js 라우팅 관련해서 질문 있어요",
    author: "박지영",
    date: "2024.07.08",
    views: 172,
    comments: 3,
    isNew: true,
  },
  {
    id: 3,
    number: 6,
    category: "정보",
    title: "주간 학습 자료 모음 공유합니다",
    author: "최현우",
    date: "2024.07.07",
    views: 198,
    comments: 1,
  },
  {
    id: 4,
    number: 5,
    category: "자유",
    title: "스터디룸 공지 확인 부탁드려요",
    author: "김서연",
    date: "2024.07.07",
    views: 145,
  },
  {
    id: 5,
    number: 4,
    category: "Q&A",
    title: "Tailwind로 반응형 구성할 때 팁 있을까요?",
    author: "이도윤",
    date: "2024.07.06",
    views: 167,
    comments: 2,
  },
  {
    id: 6,
    number: 3,
    category: "정보",
    title: "7월 스터디 모임 일정 공유",
    author: "한지민",
    date: "2024.07.05",
    views: 190,
  },
  {
    id: 7,
    number: 2,
    category: "자유",
    title: "이번 주 프로젝트 회고 나눠요",
    author: "오세훈",
    date: "2024.07.04",
    views: 156,
    comments: 4,
  },
  {
    id: 8,
    number: 1,
    category: "Q&A",
    title: "React Query 캐싱 전략 조언 부탁드립니다",
    author: "정유진",
    date: "2024.07.02",
    views: 210,
  },
];

const paginationPages = [1, 2, 3, 4, 5];

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-emerald-600">COMMUNITY</p>
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
            커뮤니티 게시판
          </h1>
          <p className="text-sm leading-6 text-zinc-600 sm:text-base">
            스터디원들과 소식을 공유하고 질문에 답하며 함께 성장하는 공간입니다.
            공지, 자유, Q&amp;A, 정보 탭을 오가며 필요한 내용을 빠르게
            찾아보세요.
          </p>
        </header>

        <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex flex-wrap gap-2">
              {boardCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    category === "전체"
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-800"
                  }`}
                  aria-pressed={category === "전체"}
                >
                  {category}
                </button>
              ))}
            </nav>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <BoardSearchBar />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 whitespace-nowrap"
              >
                글쓰기
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            최신 게시글은 상단에 표시됩니다. 실제 데이터 연동 전까지는 예시
            콘텐츠가 노출됩니다.
          </p>
        </section>

        <section>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-sm text-zinc-700">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      번호
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      분류
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      제목
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      작성자
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      작성일
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      조회수
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm text-zinc-600">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className={`transition-colors ${
                        post.pinned
                          ? "bg-amber-50/70 hover:bg-amber-100/80"
                          : "hover:bg-zinc-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-zinc-500">
                        {post.pinned ? "공지" : post.number}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${categoryStyles[post.category]}`}
                        >
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2 text-zinc-800">
                          <span className="font-semibold hover:text-emerald-600">
                            {post.title}
                          </span>
                          {typeof post.comments === "number" ? (
                            <span className="text-xs font-medium text-emerald-600">
                              [{post.comments}]
                            </span>
                          ) : null}
                          {post.isNew ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                              New
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {post.author}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {post.date}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-zinc-500">
                        {post.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-4 text-sm text-zinc-600">
              <button
                type="button"
                className="rounded-lg px-3 py-2 font-medium transition hover:bg-zinc-100"
              >
                이전
              </button>
              <div className="flex items-center gap-1">
                {paginationPages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                      page === 1
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-600 hover:bg-zinc-200"
                    }`}
                    aria-current={page === 1 ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rounded-lg px-3 py-2 font-medium transition hover:bg-zinc-100"
              >
                다음
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
