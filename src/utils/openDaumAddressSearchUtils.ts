import { mapPostcodeToArtistProfileRegion, type ArtistProfileRegion } from "../Types/artistRegionTypes"
import { loadDaumPostcodeScript } from "./loadDaumPostcodeScript";

type OpenDaumAddressSearchParams = {
  onSelect: (region: ArtistProfileRegion) => void;
};

export const openDaumAddressSearch = async ({
  onSelect,
}: OpenDaumAddressSearchParams) => {
  await loadDaumPostcodeScript();

  if (!window.daum?.Postcode) {
    throw new Error("다음 주소검색을 사용할 수 없습니다.");
  }

  new window.daum.Postcode({
    oncomplete: (data) => {
      const mapped = mapPostcodeToArtistProfileRegion(data);
      onSelect(mapped);
    },
  }).open();
};