import type {
  ReviewCreateReq,
  ReviewKeywordResp,
  ReviewReplyCreateReq,
  ReviewReplyUpdateReq,
  ReviewResp,
  ReviewUpdateReq,
} from "../../Types/reviewTypes";
import { instance } from "../instance/instance";

// 리뷰 키워드 받아오기
export const getReviewKeywordsReq = async () => {
  const resp = await instance.get<ReviewKeywordResp[]>("/reviews/keywords");
  return resp.data;
};

// 리뷰 생성
export const createReviewReq = async (body: ReviewCreateReq) => {
  const resp = await instance.post<{ reviewId: number }>("/reviews", body);
  return resp.data;
};

// 내 리뷰 받아오기
export const getMyReviewReq = async () => {
  const resp = await instance.get<ReviewResp[]>("/reviews/me");
  return resp.data;
};

// 내 리뷰 수정
export const updateReviewReq = async ({
  reviewId,
  body,
}: {
  reviewId: number;
  body: ReviewUpdateReq;
}) => {
  const resp = await instance.put<{ reviewId: number }>(
    `/api/reviews/${reviewId}`,
    body,
  );
  return resp.data;
};

// 리뷰 삭제
export const deleteReviewReq = async (reviewId: number) => {
  await instance.delete(`/reviews/${reviewId}`);
};

// 특정 레슨의 리뷰
export const getLessonReviewReq = async (lessonId: number) => {
  const resp = await instance.get<ReviewResp[]>(`/reviews/lessons/${lessonId}`);
  return resp.data;
};

// 특정 아티스트가 받은 리뷰
export const getArtistReviewReq = async (artistProfileId: number) => {
  const resp = await instance.get<ReviewResp[]>(
    `/reviews/lessons/${artistProfileId}`,
  );
  return resp.data;
};

// 리뷰 답글 (아티스트)
export const createReviewReplyReq = async (body: ReviewReplyCreateReq) => {
  const resp = await instance.post<{ reviewReplyId: number }>(
    "/reviews/replies",
    body,
  );
  return resp.data;
};

// 리뷰 답글 수정 (아티스트)
export const updateReviewReplyReq = async ({
  reviewReplyId,
  body,
}: {
  reviewReplyId: number;
  body: ReviewReplyUpdateReq;
}) => {
  const response = await instance.put<{ reviewReplyId: number }>(
    `/api/reviews/replies/${reviewReplyId}`,
    body,
  );
  return response.data;
};

// 리뷰 답글 삭제
export const deleteReviewReplyReq = async (reviewReplyId: number) => {
  await instance.delete(`/api/reviews/replies/${reviewReplyId}`);
};
