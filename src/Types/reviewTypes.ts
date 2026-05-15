// 리뷰 키워드 반환 타입
export type ReviewKeywordResp = {
  reviewKeywordId: number;
  keywordName: string;
  displayOrder: number;
};

// 리뷰 답글 반환 타입
export type ReviewReplyResp = {
  reviewReplyId: number;
};

// 리뷰 반환 타입
export type ReviewResp = {
  reviewId: number;
  reservationId: number;
  lessonId: number;
  lessonTitle: string;
  artistProfileId: number;
  artistName: string;
  reviewerUserId: number;
  reviewerName: string;
  rating: number;
  content: string | null;
  keywords: ReviewKeywordResp[];
  reply: ReviewReplyResp | null;
  createDt: string;
  updateDt: string | null;
};

// 리뷰 생성 요청 타입
export type ReviewCreateReq = {
  reservationId: number;
  rating: number;
  content?: string | null;
  keywordIds?: number[];
};

// 리뷰 수정 요청 타입
export type ReviewUpdateReq = {
  rating: number;
  content?: string | null;
  keywordIds?: number[];
};

// 아티스트 리뷰 답글 요청 타입
export type ReviewReplyCreateReq = {
  reviewId: number;
  content: string;
};

// 아티스트 리뷰 답글 수정 요청 타입
export type ReviewReplyUpdateReq = {
  content: string;
};
