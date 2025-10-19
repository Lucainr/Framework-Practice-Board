import Link from "next/link";
import BoardSearchBar from "../_components/board-search-bar";

type PostListItem = {
  id: number;
  title: string;
  category: string;
  author: string;
  createdAt: string;
  views: number;
  commentCount: number;
  isNew: boolean;
  pinned?: boolean;
};

type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type PostListResponse = {
  posts: PostListItem[];
  pagination: PaginationInfo;
};

const boardCategories = [
  "전체",
  "공지",
  "자유",
  "Q&A",
  "정보"
] as const;

const CATEGORY_STYLES: Record<string, string> = {
  공지: "bg-amber-100 text-amber-700",
  자유: "bg-sky-100 text-sky-700",
  "Q&A": "bg-indigo-100 text-indigo-700",
  정보: "bg-emerald-100 text-emerald-700",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const CATEGORY_ALIASES: Record<string, string> = {
  notice: "공지",
  "notice-board": "공지",
  공지: "공지",
  공지사항: "공지",
  free: "자유",
  자유: "자유",
  qna: "Q&A",
  "q&a": "Q&A",
  qa: "Q&A",
  question: "Q&A",
  info: "정보",
  information: "정보",
  정보: "정보",
};

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function normalizeCategory(value?: string) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "전체") {
    return "";
  }

  const aliasKey = trimmed.toLowerCase();
  return CATEGORY_ALIASES[aliasKey] ?? trimmed;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function fetchPosts(
  category: string,
  page: number,
  search: string,
): Promise<PostListResponse> {
  const normalizedFilter = normalizeCategory(category);
  const trimmedSearch = search.trim();

  const searchParams = new URLSearchParams();
  if (normalizedFilter !== "") {
    searchParams.set("category", normalizedFilter);
  }
  searchParams.set("page", String(Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1)));
  searchParams.set("limit", "10");
  if (trimmedSearch) {
    searchParams.set("search", trimmedSearch);
  }

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  try {
    const response = await fetch(`${API_BASE_URL}/posts${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to load posts", await response.text());
      return {
        posts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      } satisfies PostListResponse;
    }

    const { data, pagination } = (await response.json()) as {
      data: Array<
        PostListItem & {
          created_at?: string;
          date?: string;
          comments?: unknown;
          isNew?: boolean;
        }
      >;
      pagination: PaginationInfo;
    };

    const posts = data.map((post) => {
      const normalizedCategoryValue = normalizeCategory(post.category);
      const createdAtSource =
        post.createdAt ?? post.created_at ?? post.date ?? new Date().toISOString();
      const createdAtDate = new Date(createdAtSource);
      const isValidDate = !Number.isNaN(createdAtDate.getTime());

      const commentCount = Array.isArray(post.comments)
        ? post.comments.length
        : typeof post.comments === "number"
          ? post.comments
          : 0;

      const isNew = post.isNew ?? (isValidDate && isToday(createdAtDate));

      return {
        id: post.id,
        title: post.title,
        category: normalizedCategoryValue || post.category,
        author: post.author,
        views: post.views,
        pinned: post.pinned ?? false,
        createdAt: isValidDate ? createdAtDate.toISOString() : String(createdAtSource),
        commentCount,
        isNew,
      } satisfies PostListItem;
    });

    return {
      posts,
      pagination: {
        page: pagination?.page ?? 1,
        limit: pagination?.limit ?? 10,
        total: pagination?.total ?? posts.length,
        totalPages: pagination?.totalPages ?? Math.max(1, Math.ceil(posts.length / 10)),
      },
    } satisfies PostListResponse;
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    } satisfies PostListResponse;
  }
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const resolved = searchParams ? await searchParams : {};
  const categoryParam = resolved.category;
  const searchParam = resolved.search;
  const selectedCategory = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam ?? "전체";

  const pageParam = resolved.page;
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsedPage = pageValue ? Number.parseInt(pageValue, 10) : 1;
  const selectedPage = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);

  const searchValue = Array.isArray(searchParam)
    ? searchParam[0] ?? ""
    : searchParam ?? "";
  const searchTerm = searchValue.trim();

  const { posts, pagination } = await fetchPosts(
    selectedCategory,
    selectedPage,
    searchTerm,
  );
  const activePage = pagination.page;
  const totalPages = pagination.totalPages;

  const groupStart = Math.floor((activePage - 1) / 5) * 5 + 1;
  const groupEnd = Math.min(groupStart + 4, totalPages);
  const pageNumbers = Array.from({ length: groupEnd - groupStart + 1 }, (_, idx) => groupStart + idx);

  const prevGroupPage = Math.max(1, groupStart - 5);
  const nextGroupPage = Math.min(totalPages, groupStart + 5);
  const hasPrevGroup = groupStart > 1;
  const hasNextGroup = groupEnd < totalPages;

  const buildQuery = (pageNumber: number) => {
    const query: Record<string, string> = {};
    if (selectedCategory !== "전체") {
      query.category = selectedCategory;
    }
    if (searchTerm) {
      query.search = searchTerm;
    }
    if (pageNumber > 1) {
      query.page = String(pageNumber);
    }
    return query;
  };

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
                <Link
                  key={category}
                  href={{
                    pathname: "/main-board",
                    query:
                      category === "전체"
                        ? searchTerm
                          ? { search: searchTerm }
                          : undefined
                        : {
                            category,
                            ...(searchTerm ? { search: searchTerm } : {}),
                          },
                  }}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-800"
                  }`}
                  >
                  {category}
                </Link>
              ))}
            </nav>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <BoardSearchBar
                defaultValue={searchValue}
                category={selectedCategory === "전체" ? undefined : selectedCategory}
              />
              <Link
                href="/posts/new"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 whitespace-nowrap"
              >
                글쓰기
              </Link>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            최신 게시글은 상단에 표시됩니다. 카테고리를 선택해 필요한 정보를
            빠르게 찾아보세요.
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
                  {posts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-sm text-zinc-500"
                      >
                        선택한 카테고리에 해당하는 게시글이 없습니다.
                      </td>
                    </tr>
                  ) : null}
                  {posts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`transition-colors ${
                        post.category === "공지"
                          ? "bg-amber-50/70 hover:bg-amber-100/80"
                          : "hover:bg-zinc-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-zinc-500">
                        {posts.length - index}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            CATEGORY_STYLES[post.category] ?? "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2 text-zinc-800">
                          <Link
                            href={`/posts/${post.id}`}
                            className="font-semibold text-emerald-700 underline-offset-2 hover:text-emerald-600 hover:underline"
                          >
                            {post.title}
                          </Link>
                          {post.commentCount > 0 ? (
                            <span className="text-xs font-medium text-emerald-600">
                              [{post.commentCount}]
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
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-zinc-500">
                        {post.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center border-t border-zinc-200 bg-zinc-50 px-6 py-4 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                {hasPrevGroup ? (
                  <Link
                    href={{ pathname: "/main-board", query: buildQuery(prevGroupPage) }}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    이전
                  </Link>
                ) : (
                  <span className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300">
                    이전
                  </span>
                )}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((page) => (
                    <Link
                      key={page}
                      href={{ pathname: "/main-board", query: buildQuery(page) }}
                      className={`h-9 w-9 rounded-lg text-sm font-semibold transition flex items-center justify-center ${
                        page === activePage
                          ? "bg-zinc-900 text-white shadow-sm"
                          : "text-zinc-600 hover:bg-zinc-200"
                      }`}
                      aria-current={page === activePage ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  ))}
                </div>
                {hasNextGroup ? (
                  <Link
                    href={{ pathname: "/main-board", query: buildQuery(nextGroupPage) }}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    다음
                  </Link>
                ) : (
                  <span className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300">
                    다음
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
