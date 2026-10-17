import type { ArtistProfileRegion, ArtistServiceRegion } from "../Types/artistRegionTypes";

// 아티스트 프로필 폼 값 <-> 서버 응답 비교용 정규화 (아티스트 프로필 / 아티스트 신청 화면 공용)
// 모양(키, null/빈 문자열, 순서)이 달라도 같은 내용이면 같은 문자열이 나오게 함
// (예전엔 폼에만 있는 상세 주소·도로명 키 때문에 스튜디오 주소가 있으면 항상 "변경됨"이었고,
//  서비스 지역은 읍/면/동을 비교하지 않아 동만 바꾸면 저장 버튼이 켜지지 않았음)
export const normMain = (r: ArtistProfileRegion | null | undefined) =>
  r && (r.region1DepthName || r.addressLabel)
    ? JSON.stringify([
        r.region1DepthName ?? null,
        r.region2DepthName ?? null,
        r.region3DepthName ?? null,
        r.addressLabel ?? null,
        r.detailAddress?.trim() || null,
        r.latitude ?? null,
        r.longitude ?? null,
      ])
    : "null";

export const normServices = (list: ArtistServiceRegion[] | null | undefined) =>
  JSON.stringify(
    (list ?? [])
      .map((r) => [r.region1DepthName, r.region2DepthName ?? "", r.region3DepthName ?? ""].join("|"))
      .sort(),
  );

export const sameIds = (a: number[], b: number[]) =>
  JSON.stringify([...a].sort((x, y) => x - y)) === JSON.stringify([...b].sort((x, y) => x - y));
