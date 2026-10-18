import type {
  ReviewCreateReq,
  ReviewKeywordResp,
  ReviewListResp,
  ReviewReplyCreateReq,
  ReviewReplyUpdateReq,
  ReviewResp,
  ReviewUpdateReq,
  WritableReviewResp,
} from "../../Types/reviewTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 예전 코드: 일부 주소에 없는 "/api" 접두어, 아티스트 리뷰가 레슨 리뷰 주소를 부르던 문제 -> 정리

// 리뷰 태그 목록
export const getReviewKeywordsReq = async () =>
  (await instance.get<ApiRespDto<ReviewKeywordResp[]>>("/reviews/keywords")).data.data;

// 리뷰 작성
export const createReviewReq = async (body: ReviewCreateReq) =>
  (await instance.post<ApiRespDto<{ reviewId: number }>>("/reviews", body)).data.data;

// 리뷰 수정
export const updateReviewReq = async ({ reviewId, body }: { reviewId: number; body: ReviewUpdateReq }) =>
  (await instance.put<ApiRespDto<{ reviewId: number }>>(`/reviews/${reviewId}`, body)).data.data;

// 리뷰 삭제
export const deleteReviewReq = async (reviewId: number) => {
  await instance.delete(`/reviews/${reviewId}`);
};

// 내가 쓴 리뷰
export const getMyReviewsReq = async () =>
  (await instance.get<ApiRespDto<ReviewResp[]>>("/reviews/me")).data.data;

// 리뷰를 쓸 수 있는 완료 레슨
export const getWritableReviewsReq = async () =>
  (await instance.get<ApiRespDto<WritableReviewResp[]>>("/reviews/me/writable")).data.data;

// 내가(아티스트) 받은 리뷰
export const getReceivedReviewsReq = async () =>
  (await instance.get<ApiRespDto<ReviewListResp>>("/reviews/received")).data.data;

// 레슨 리뷰 모음
export const getLessonReviewsReq = async (lessonId: number) =>
  (await instance.get<ApiRespDto<ReviewListResp>>(`/reviews/lessons/${lessonId}`)).data.data;

// 아티스트가 받은 전체 리뷰 모음
export const getArtistReviewsReq = async (artistProfileId: number) =>
  (await instance.get<ApiRespDto<ReviewListResp>>(`/reviews/artists/${artistProfileId}`)).data.data;

// 답글 작성 (아티스트)
export const createReviewReplyReq = async (body: ReviewReplyCreateReq) =>
  (await instance.post<ApiRespDto<{ reviewReplyId: number }>>("/reviews/replies", body)).data.data;

// 답글 수정 (아티스트)
export const updateReviewReplyReq = async ({ reviewReplyId, body }: { reviewReplyId: number; body: ReviewReplyUpdateReq }) =>
  (await instance.put<ApiRespDto<{ reviewReplyId: number }>>(`/reviews/replies/${reviewReplyId}`, body)).data.data;

// 답글 삭제 (아티스트)
export const deleteReviewReplyReq = async (reviewReplyId: number) => {
  await instance.delete(`/reviews/replies/${reviewReplyId}`);
};
