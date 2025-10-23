import type { PostSummary } from "../types/post.js";

export const samplePosts: PostSummary[] = [
  {
    id: 0,
    pinned: true,
    category: "공지",
    title: "커뮤니티 이용 가이드와 운영 원칙 안내",
    author: "운영자",
    date: "2024.07.01",
    views: 1290
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
    isNew: true
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
    isNew: true
  },
  {
    id: 3,
    number: 6,
    category: "정보",
    title: "주간 학습 자료 모음 공유합니다",
    author: "최현우",
    date: "2024.07.07",
    views: 198,
    comments: 1
  },
  {
    id: 4,
    number: 5,
    category: "자유",
    title: "스터디룸 공지 확인 부탁드려요",
    author: "김서연",
    date: "2024.07.07",
    views: 145
  },
  {
    id: 5,
    number: 4,
    category: "Q&A",
    title: "Tailwind로 반응형 구성할 때 팁 있을까요?",
    author: "이도윤",
    date: "2024.07.06",
    views: 167,
    comments: 2
  },
  {
    id: 6,
    number: 3,
    category: "정보",
    title: "7월 스터디 모임 일정 공유",
    author: "한지민",
    date: "2024.07.05",
    views: 190
  },
  {
    id: 7,
    number: 2,
    category: "자유",
    title: "이번 주 프로젝트 회고 나눠요",
    author: "오세훈",
    date: "2024.07.04",
    views: 156,
    comments: 4
  },
  {
    id: 8,
    number: 1,
    category: "Q&A",
    title: "React Query 캐싱 전략 조언 부탁드립니다",
    author: "정유진",
    date: "2024.07.02",
    views: 210
  }
];
