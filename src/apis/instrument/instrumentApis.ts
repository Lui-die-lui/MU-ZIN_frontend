import type { InstrumentResponse } from "../../Types/instrumentTypes";
import { instance } from "../instance/instance";

// 레슨 악기 카테고리 가져오기
export const getInstrumentCategoriesReq = () =>
  instance.get<string[]>("/instruments/categories");

// 레슨 악기 가져오기(카테고리 하위 악기 가능, 악기만 단일로도 가능)
export const getInstrumentsReq = (params?: {
  category?: string;
  q?: string;
}) => {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.q?.trim()) qs.set("q", params.q.trim());

  const url = qs.toString() ? `/instruments?${qs.toString()}` : "/instruments";
  return instance.get<InstrumentResponse[]>(url);
};
