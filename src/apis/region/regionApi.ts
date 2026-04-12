import type { RegionOption } from "../../Types/artistRegionTypes";
import { instance } from "../instance/instance";

export const getSidoListReq = async (q?: string): Promise<RegionOption[]> => {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());

  const resp = await instance.get(`/regions/sido?${params.toString()}`);
  return resp.data;
};

export const getChildRegionsReq = async (
  parentId: number,
  q?: string,
): Promise<RegionOption[]> => {
  const params = new URLSearchParams();
  params.set("parentId", String(parentId));
  if (q?.trim()) params.set("q", q.trim());

  const resp = await instance.get(`/regions/children?${params.toString()}`);
  return resp.data;
};
