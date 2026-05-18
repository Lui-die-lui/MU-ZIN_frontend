import { useQuery } from "@tanstack/react-query";
import { reviewKeys } from "./reviewKeys";
import { getReviewKeywordsReq } from "../../apis/review/reviewApi";

export const useReviewKeywords = () => {
  return useQuery({
    queryKey: reviewKeys.keywords(),
    queryFn: getReviewKeywordsReq,
    staleTime: 1000 * 60 * 30,
  });
};
