"use client";

type BoardSearchBarProps = {
  placeholder?: string;
  defaultValue?: string;
  category?: string;
};

export default function BoardSearchBar({
  placeholder = "검색어를 입력하세요",
  defaultValue = "",
  category,
}: BoardSearchBarProps) {
  return (
    <form
      role="search"
      method="get"
      action="/main-board"
      className="flex w-full items-center gap-3 rounded-2xl border border-[rgba(226,230,240,0.8)] bg-[rgba(255,255,255,0.96)] px-5 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition focus-within:border-[rgba(10,132,255,0.85)] focus-within:shadow-[0_16px_36px_rgba(10,132,255,0.18)] sm:w-auto"
    >
      {category ? (
        <input type="hidden" name="category" value={category} />
      ) : null}
      <label htmlFor="board-search" className="sr-only">
        게시판 검색
      </label>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        className="h-5 w-5 text-[rgba(105,116,134,0.65)]"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m15.5 15.5-3.5-3.5m1-3a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        />
      </svg>
      <input
        id="board-search"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        name="search"
        className="flex-1 border-none bg-transparent text-sm text-[var(--foreground)] placeholder:text-[rgba(110,116,128,0.55)] focus:outline-none"
      />
      <button
        type="submit"
        className="hidden rounded-full border border-[rgba(210,214,224,0.8)] bg-[rgba(244,244,247,0.9)] px-4 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[rgba(233,234,240,0.95)] sm:inline-flex"
      >
        검색
      </button>
    </form>
  );
}
