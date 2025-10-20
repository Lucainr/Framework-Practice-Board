"use client";

import Link from "next/link";

type CommunityHeroProps = {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function CommunityHero({
  primaryHref = "/login",
  primaryLabel = "커뮤니티 게시판 바로가기",
  secondaryHref = "/info-board",
  secondaryLabel = "스터디 소개 보기",
}: CommunityHeroProps) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24">
      <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-semibold tracking-[0.28em] text-emerald-500">
          STUDY HUB
        </p>
        <h1 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
          Jungle Study Community
        </h1>
        <p className="text-base leading-7 text-zinc-600 sm:text-lg">
          스터디원들의 소식과 자료를 공유하는 공간입니다. 게시판에서 공지, 자유
          대화, 질문답변, 정보 글을 확인해보세요.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 px-8 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
