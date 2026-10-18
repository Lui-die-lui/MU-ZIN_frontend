// 리뷰 태그 (친절해요, 꼼꼼해요 ...)
export type ReviewKeywordResp = {
  reviewKeywordId: number;
  keywordName: string;
  displayOrder: number;
};

// 아티스트 답글 (리뷰당 1개)
export type ReviewReplyResp = {
  reviewReplyId: number;
  artistProfileId: number;
  artistName: string;
  content: string;
  createDt: string;
  updateDt: string | null;
};

export type ReviewResp = {
  reviewId: number;
  reservationId: number;
  lessonId: number;
  lessonTitle: string;
  artistProfileId: number;
  artistName: string;
  reviewerUserId: number;
  reviewerName: string;
  reviewerProfileImgUrl: string | null;
  rating: number;
  content: string | null;
  keywords: ReviewKeywordResp[];
  reply: ReviewReplyResp | null;
  lessonStartDt: string; // 언제 받은 레슨인지
  createDt: string;
  updateDt: string | null;
  editableUntil: string; // 작성자가 수정할 수 있는 마감 (작성 후 7일)
};

// 많이 선택된 태그 순위
export type ReviewKeywordCount = {
  reviewKeywordId: number;
  keywordName: string;
  count: number;
};

export type ReviewSummary = {
  reviewCount: number;
  averageRating: number;
  ratingCounts: number[]; // [5점, 4점, 3점, 2점, 1점]
  topKeywords: ReviewKeywordCount[];
};

// 레슨/아티스트 리뷰 모음
export type ReviewListResp = {
  summary: ReviewSummary;
  reviews: ReviewResp[];
};

// 아직 리뷰를 쓰지 않은 완료 레슨
export type WritableReviewResp = {
  reservationId: number;
  lessonId: number;
  lessonTitle: string;
  artistProfileId: number;
  artistName: string;
  lessonStartDt: string;
  lessonEndDt: string;
  completedDt: string;
  writableUntil: string;
};

export type ReviewCreateReq = {
  reservationId: number;
  rating: number;
  content?: string | null;
  keywordIds?: number[];
};

export type ReviewUpdateReq = {
  rating: number;
  content?: string | null;
  keywordIds?: number[];
};

export type ReviewReplyCreateReq = {
  reviewId: number;
  content: string;
};

export type ReviewReplyUpdateReq = {
  content: string;
};

// 정책 (백엔드 ReviewService 와 같은 값)
export const REVIEW_MAX_KEYWORDS = 3;
export const REVIEW_CONTENT_MAX = 500;
export const REVIEW_WRITE_DAYS = 14;
