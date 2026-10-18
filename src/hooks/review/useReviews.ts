import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewKeys } from "./reviewKeys";
import {
  createReviewReplyReq,
  createReviewReq,
  deleteReviewReplyReq,
  deleteReviewReq,
  getArtistReviewsReq,
  getLessonReviewsReq,
  getMyReviewsReq,
  getReceivedReviewsReq,
  getReviewKeywordsReq,
  getWritableReviewsReq,
  updateReviewReplyReq,
  updateReviewReq,
} from "../../apis/review/reviewApi";
import { notificationKeys } from "../notification/notificationKeys";

// ---------- 조회 ----------

export const useReviewKeywords = () =>
  useQuery({ queryKey: reviewKeys.keywords(), queryFn: getReviewKeywordsReq, staleTime: 1000 * 60 * 30 });

export const useMyReviews = (enabled = true) =>
  useQuery({ queryKey: reviewKeys.me(), queryFn: getMyReviewsReq, enabled });

export const useWritableReviews = (enabled = true) =>
  useQuery({ queryKey: reviewKeys.writable(), queryFn: getWritableReviewsReq, enabled });

export const useReceivedReviews = (enabled = true) =>
  useQuery({ queryKey: reviewKeys.received(), queryFn: getReceivedReviewsReq, enabled });

export const useLessonReviews = (lessonId: number | null | undefined) =>
  useQuery({
    queryKey: reviewKeys.lesson(lessonId ?? 0),
    queryFn: () => getLessonReviewsReq(lessonId!),
    enabled: !!lessonId,
  });

export const useArtistReviews = (artistProfileId: number | null | undefined) =>
  useQuery({
    queryKey: reviewKeys.artist(artistProfileId ?? 0),
    queryFn: () => getArtistReviewsReq(artistProfileId!),
    enabled: !!artistProfileId,
  });

// ---------- 변경 ----------
// 리뷰/답글이 바뀌면 리뷰가 보이는 모든 곳(내 리뷰, 작성 가능 목록, 받은 리뷰, 레슨·아티스트 리뷰)을 다시 불러옴
// + 상대방 알림이 생기므로 알림 개수도

const useInvalidateReviews = () => {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: reviewKeys.all }),
      qc.invalidateQueries({ queryKey: notificationKeys.unread() }),
    ]);
};

export const useCreateReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: createReviewReq, onSuccess: invalidate });
};

export const useUpdateReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: updateReviewReq, onSuccess: invalidate });
};

export const useDeleteReview = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: deleteReviewReq, onSuccess: invalidate });
};

export const useCreateReviewReply = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: createReviewReplyReq, onSuccess: invalidate });
};

export const useUpdateReviewReply = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: updateReviewReplyReq, onSuccess: invalidate });
};

export const useDeleteReviewReply = () => {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: deleteReviewReplyReq, onSuccess: invalidate });
};
