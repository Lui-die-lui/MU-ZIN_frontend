// 아티스트 서비스 지역
export type ArtistServiceRegion = {
  region1DepthName: string;
  region2DepthName: string | null;
  region3DepthName: string | null;
};

export type RegionSearchValue = {
  region1DepthName: string;
  region2DepthName: string | null;
  region3DepthName: string | null;
};

// 아티스트 서비스 지역 요청 타입(추후 확장성 고려)
export type ArtistServiceRegionRequest = {
  region1DepthName: string;
  region2DepthName: string | null;
  region3DepthName: string | null;
};

// 아티스트 주 활동 지역
export type ArtistProfileRegion = {
  region1DepthName: string | null;
  region2DepthName: string | null;
  region3DepthName?: string | null;
  addressLabel?: string | null;
  roadAddress?: string | null;
  jibunAddress?: string | null;
  detailAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

// 아티스트 주 활동 지역 요청 타입(추후 확장성 고려)
export type ArtistProfileRegionRequest = {
  region1DepthName: string | null;
  region2DepthName: string | null;
  region3DepthName?: string | null;
  addressLabel?: string | null;
  roadAddress?: string | null;
  jibunAddress?: string | null;
  detailAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

// 지역 정보 타입
export type RegionOption = {
  regionId: number;
  name: string;
  fullName: string;
  depth: number;
  parentRegionId: number | null;
};

export type RegionFieldState = {
  input: string;
  selected: RegionOption | null;
  isInvalid: boolean;
  message: string;
};

// 다음 주소찾기 타입
export type DaumPostcodeData = {
  address: string;
  addressType: "R" | "J";
  bname: string;
  buildingName: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
};

// 다음(카카오) 주소찾기 매핑
export const mapPostcodeToArtistProfileRegion = (
  data: DaumPostcodeData,
): ArtistProfileRegion => {
  const addressLabel =
    data.roadAddress || data.jibunAddress || data.address || null;

  return {
    region1DepthName: data.sido || null,
    region2DepthName: data.sigungu || null,
    region3DepthName: data.bname || null,
    addressLabel,
    roadAddress: data.roadAddress || null,
    jibunAddress: data.jibunAddress || null,
    latitude: null,
    longitude: null,
  };
};

// 카카오 맵 역지오코딩시 타입
export type KakaoRegionCodeResult = {
  region_type: "H" | "B" | string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
};
