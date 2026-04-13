import type { ArtistProfileRegionRequest } from "../Types/artistRegionTypes";

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
