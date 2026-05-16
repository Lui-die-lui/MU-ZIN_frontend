import type { ReviewKeywordResp } from "../../Types/reviewTypes";
import { instance } from "../instance/instance";

export const getReviewKeywordsReq = async () => {
  const resp = await instance.get<ReviewKeywordResp[]>("/review/keywords");
  return resp.data;
};
