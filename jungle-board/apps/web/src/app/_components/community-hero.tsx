"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type CommunityHeroProps = {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function CommunityHero({
  primaryHref = "/login",
  primaryLabel = "커뮤니티 들어가기",
  secondaryHref = "/info-board",
  secondaryLabel = "보드 둘러보기",
}: CommunityHeroProps) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(primaryHref);
    router.prefetch(secondaryHref);
  }, [primaryHref, secondaryHref, router]);

  const features = [
    {
      title: "공지 허브",
      description: "주요 공지, 일정, 운영 소식을 정제된 뷰로 확인하세요.",
      href: "/notice-board",
      accent: "NOTICE",
    },
    {
      title: "인사이트 컬렉션",
      description: "스터디원들이 공유하는 자료와 링크를 큐레이션 합니다.",
      href: "/info-board",
      accent: "INSIGHT",
    },
    {
      title: "대화 & Q&A",
      description: "가벼운 이야기부터 깊이 있는 질문까지 자연스럽게 이어집니다.",
      href: "/free-board",
      accent: "DIALOG",
    },
  ];

  return (
    <section className="space-y-16 pb-10 pt-12 sm:space-y-20 sm:pb-16 sm:pt-16">
      <div className="panel fade-up relative overflow-hidden px-8 py-14 sm:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(120,153,204,0.18),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(179,210,255,0.22),transparent_58%),radial-gradient(circle_at_50%_100%,rgba(170,190,220,0.14),transparent_60%)]" />
        <div className="relative flex flex-col items-center gap-8 text-center sm:gap-10">
          <span className="pill mx-auto bg-[rgba(210,214,224,0.45)] text-[var(--foreground)]">
            Wook Community
          </span>
          <h1 className="text-4xl font-semibold leading-tight tracking-[-0.022em] text-[var(--foreground)] sm:text-[50px]">
            차분함 속에서 만나는
            {" "}
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Wook Board
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl fade-up fade-delay-1">
            공지, 정보, Q&amp;A를 하나의 구조 안에서 흔들림 없이 마음껏 탐색하세요.
          </p>
          <div className="fade-up fade-delay-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href={primaryHref} className="primary-button text-base">
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="secondary-button text-base"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="card fade-up flex min-h-[210px] flex-col justify-between px-7 py-6 transition hover:translate-y-[-4px]"
            style={{ animationDelay: `${0.12 * (index + 1)}s` }}
          >
            <div className="space-y-3">
              <span className="inline-flex w-fit items-center rounded-full border border-[rgba(210,214,224,0.6)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {feature.accent}
              </span>
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {feature.description}
              </p>
            </div>
            <span className="text-sm font-semibold text-[var(--accent-primary)]">
              살펴보기 →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
