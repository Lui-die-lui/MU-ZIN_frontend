
import type {
  ArtistSearchDraft,
  ArtistSearchReq,
  SearchMainRegionSummary,
  SearchServiceRegionResp,
} from "../Types/artistSearchTypes";

export function makeArtistSearchParams(
  draft: ArtistSearchDraft, // 입력된 값
): ArtistSearchReq {
  // 요청 기반 파라미터로 변환
  return {
    keyword: draft.keyword.trim() || undefined,
    instCategory: draft.instCategory === "ALL" ? undefined : draft.instCategory,
    instIds: draft.instIds.length ? draft.instIds : undefined,
    styleTagIds: draft.styleTagIds.length ? draft.styleTagIds : undefined,
    region1DepthName: draft.region1DepthName.length
      ? draft.region1DepthName
      : undefined,
    region2DepthName: draft.region2DepthName.length
      ? draft.region2DepthName
      : undefined,
    region3DepthName: draft.region3DepthName.length
      ? draft.region3DepthName
      : undefined,
  };
}

export const formatArtistMainRegion = (
  mainRegion: SearchMainRegionSummary | null,
) => {
  if (!mainRegion) return null;

  if (mainRegion.addressLabel?.trim()) {
    return mainRegion.addressLabel;
  }

  const parts = [
    mainRegion.region1DepthName,
    mainRegion.region2DepthName,
    mainRegion.region3DepthName,
  ].filter(Boolean);

  return parts.length ? parts.join(" ") : null;
};

export type RegionOption = {
  value: string;
  label: string;
};

export const formatArtistServiceRegions = (
  regions: SearchServiceRegionResp[],
) => {
  if (!regions.length) return null;

  const first = regions[0];
  const firstLabel = [
    first.region1DepthName,
    first.region2DepthName,
    first.region3DepthName,
  ]
    .filter(Boolean)
    .join(" ");

  if (regions.length === 1) return firstLabel;
  return `${firstLabel} 외 ${regions.length - 1}곳`;
};