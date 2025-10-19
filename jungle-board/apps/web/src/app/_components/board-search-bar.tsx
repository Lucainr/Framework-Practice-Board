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
      className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-2 shadow-inner sm:w-auto"
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
        className="h-5 w-5 text-zinc-400"
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
        className="flex-1 border-none bg-transparent text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
      />
      <button
        type="submit"
        className="hidden rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 sm:inline-flex"
      >
        검색
      </button>
    </form>
  );
}
