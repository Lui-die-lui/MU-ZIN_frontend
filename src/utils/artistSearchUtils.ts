import type {
  ArtistSearchDraft,
  ArtistSearchReq,
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
  };
}
