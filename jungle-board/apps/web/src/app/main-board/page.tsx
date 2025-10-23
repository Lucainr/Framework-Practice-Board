import Link from "next/link";
import BoardSearchBar from "../_components/board-search-bar";
import WritePostButton from "../_components/write-post-button";

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
  공지:
    "border border-[rgba(10,132,255,0.25)] bg-[rgba(10,132,255,0.08)] text-[#0a84ff]",
  자유:
    "border border-[rgba(142,142,147,0.28)] bg-[rgba(242,242,247,0.8)] text-[#3a3a3c]",
  "Q&A":
    "border border-[rgba(94,92,230,0.25)] bg-[rgba(94,92,230,0.08)] text-[#5e5ce6]",
  정보:
    "border border-[rgba(52,199,89,0.25)] bg-[rgba(52,199,89,0.08)] text-[#34c759]",
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
    <div className="flex flex-col gap-10">
      <header className="fade-up rounded-[28px] border border-[var(--border)] bg-[var(--background-alt)] px-8 py-10 shadow-[0_18px_48px_rgba(12,36,70,0.08)]">
        <div className="flex flex-col gap-3">
          <span className="pill w-fit">Community</span>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-[40px]">
            커뮤니티 게시판
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            정돈된 레이아웃에서 필요한 카테고리를 고르고, 검색으로 원하는 글을 찾아보세요.
          </p>
        </div>
      </header>

      <section className="fade-up fade-delay-1 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-7 py-7 shadow-[0_12px_32px_rgba(12,36,70,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-2">
            {boardCategories.map((category) => {
              const isActive = selectedCategory === category;
              return (
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
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--foreground)] text-white shadow-[0_18px_30px_rgba(28,28,31,0.16)]"
                      : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {category}
                </Link>
              );
            })}
          </nav>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <BoardSearchBar
              defaultValue={searchValue}
              category={selectedCategory === "전체" ? undefined : selectedCategory}
            />
            <WritePostButton className="whitespace-nowrap px-6 py-3 text-sm" />
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          최신 게시글부터 정렬됩니다. 카테고리별 활동 현황을 빠르게 확인해보세요.
        </p>
      </section>

      <section className="fade-up fade-delay-2 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_18px_45px_rgba(12,36,70,0.08)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border)] text-sm text-[var(--muted)]">
            <thead className="bg-[var(--surface-muted)] text-sm font-medium text-[rgba(91,100,116,0.8)]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-medium">
                  번호
                </th>
                <th scope="col" className="px-6 py-4 text-left font-medium">
                  분류
                </th>
                <th scope="col" className="px-6 py-4 text-left font-medium">
                  제목
                </th>
                <th scope="col" className="px-6 py-4 text-left font-medium">
                  작성자
                </th>
                <th scope="col" className="px-6 py-4 text-left font-medium">
                  작성일
                </th>
                <th scope="col" className="px-6 py-4 text-right font-medium">
                  조회수
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm font-medium text-[rgba(91,100,116,0.75)]">
                    선택한 조건에 해당하는 게시글이 없습니다.
                  </td>
                </tr>
              ) : null}
              {posts.map((post, index) => (
                <tr key={post.id} className="transition hover:bg-[var(--surface-muted)]">
                  <td className="px-6 py-4 text-sm font-semibold text-[rgba(91,100,116,0.75)]">
                    {posts.length - index}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                        CATEGORY_STYLES[post.category] ??
                        "border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]"
                      }`}
                    >
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2 text-[var(--foreground)]">
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-semibold text-[var(--accent-primary)] underline-offset-4 hover:text-[var(--accent-secondary)] hover:underline"
                      >
                        {post.title}
                      </Link>
                      {post.commentCount > 0 ? (
                        <span className="rounded-full bg-[var(--surface-muted)] px-2 py-[2px] text-[11px] font-medium text-[var(--muted)]">
                          +{post.commentCount}
                        </span>
                      ) : null}
                      {post.isNew ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(10,132,255,0.4)] bg-[rgba(10,132,255,0.12)] px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0a84ff] shadow-[0_6px_14px_rgba(10,132,255,0.2)]">
                          <span className="h-[6px] w-[6px] rounded-full bg-[#0a84ff]" aria-hidden="true" />
                          New
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[rgba(91,100,116,0.75)]">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-[rgba(91,100,116,0.75)]">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-[var(--foreground)]">
                    {post.views.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center border-t border-[var(--border)] bg-[var(--surface-muted)] px-6 py-4 text-sm text-[rgba(91,100,116,0.75)]">
          <div className="flex items-center gap-3">
            {hasPrevGroup ? (
              <Link
                href={{ pathname: "/main-board", query: buildQuery(prevGroupPage) }}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[rgba(233,234,240,0.95)]"
              >
                이전
              </Link>
            ) : (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[rgba(110,110,115,0.6)]">
                이전
              </span>
            )}
            <div className="flex items-center gap-2">
              {pageNumbers.map((page) => (
                <Link
                  key={page}
                  href={{ pathname: "/main-board", query: buildQuery(page) }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                    page === activePage
                      ? "bg-[var(--accent-primary)] text-white shadow-[0_14px_28px_rgba(10,132,255,0.28)]"
                      : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
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
                className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[rgba(233,234,240,0.95)]"
              >
                다음
              </Link>
            ) : (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-medium text-[rgba(110,110,115,0.6)]">
                다음
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
