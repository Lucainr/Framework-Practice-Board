export type PostCategory = "공지" | "자유" | "Q&A" | "정보";

export type PostSummary = {
  id: number;
  number?: number;
  category: PostCategory;
  title: string;
  author: string;
  date: string;
  views: number;
  comments?: number;
  pinned?: boolean;
  isNew?: boolean;
};
