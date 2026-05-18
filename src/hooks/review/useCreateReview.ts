import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewReq } from "../../apis/review/reviewApi";
import { reviewKeys } from "./reviewKeys";
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.me() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};
