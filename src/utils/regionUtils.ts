import type {
  ArtistProfileRegionRequest,
  KakaoRegionCodeResult,
} from "../Types/artistRegionTypes";
import type { SearchMainRegionSummary } from "../Types/artistSearchTypes";

type AddressSearchResult = {
  region1DepthName?: string;
  region2DepthName?: string;
  region3DepthName?: string;
  addressLabel?: string;
  roadAddress?: string;
  jibunAddress?: string;
  detailAddress?: string;
  latitude?: string | number;
  longitude?: string | number;
};

export const toActivityRegionRequest = (
  value: AddressSearchResult,
): ArtistProfileRegionRequest => {
  return {
    region1DepthName: value.region1DepthName ?? null,
    region2DepthName: value.region2DepthName ?? null,
    region3DepthName: value.region3DepthName ?? null,
    addressLabel: value.addressLabel ?? null,
    roadAddress: value.roadAddress ?? null,
    jibunAddress: value.jibunAddress ?? null,
    detailAddress: value.detailAddress ?? null,
    latitude:
      value.latitude === undefined || value.latitude === null
        ? null
        : Number(value.latitude),
    longitude:
      value.longitude === undefined || value.longitude === null
        ? null
        : Number(value.longitude),
  };
};

// 아티스트 검색 시 내 위치 받아오기
export const getCurrentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("이 브라우저에서는 위치 정보를 지원하지 않습니다."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });

// 카카오맵 역 지오코딩 유틸
export const resolveRegionFromCoords = (
  latitude: number,
  longitude: number,
): Promise<SearchMainRegionSummary> => {
  return new Promise((resolve, reject) => {
    const kakao = window.kakao;

    if (!kakao?.maps?.services) {
      reject(
        new Error("카카오 지도 services 라이브러리가 로드되지 않았습니다."),
      );
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.coord2RegionCode(
      longitude,
      latitude,
      (result: KakaoRegionCodeResult[], status: string) => {
        if (status !== kakao.maps.services.Status.OK || !result?.length) {
          reject(new Error("좌표를 지역 정보로 변환하지 못했습니다."));
          return;
        }

        const region =
          result.find((item) => item.region_type === "H") ??
          result.find((item) => item.region_type === "B");

        if (!region) {
          reject(new Error("유효한 지역 정보를 찾지 못했습니다."));
          return;
        }

        const region1DepthName = region.region_1depth_name || null;
        const region2DepthName = region.region_2depth_name || null;
        const region3DepthName = region.region_3depth_name || null;

        resolve({
          region1DepthName,
          region2DepthName,
          region3DepthName,
          addressLabel: [region1DepthName, region2DepthName, region3DepthName]
            .filter(Boolean)
            .join(" ") || null,
        });
      },
    );
  });
};

