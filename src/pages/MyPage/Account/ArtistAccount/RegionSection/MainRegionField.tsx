/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import { openDaumAddressSearch } from "../../../../../utils/openDaumAddressSearchUtils";

function MainRegionField() {
  const mainRegion = useArtistApplyFormStore((s) => s.mainRegion);
  const setField = useArtistApplyFormStore((s) => s.setField);

  const handleSelectNone = () => {
    setField("mainRegion", null);
  };

  const handleOpenAddressSearch = async () => {
    try {
      await openDaumAddressSearch({
        onSelect: (selectedRegion) => {
          setField("mainRegion", {
            ...selectedRegion,
            detailAddress: mainRegion?.detailAddress ?? null,
          });
        },
      });
    } catch (error) {
      console.error(error);
      alert("주소 검색 창을 열지 못했습니다.");
    }
  };
  const handleChangeDetailAddress = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (!mainRegion) return;

    setField("mainRegion", {
      ...mainRegion,
      detailAddress: value || null,
    });
  };

  const displayMainRegion = mainRegion
    ? [mainRegion.addressLabel, mainRegion.detailAddress]
        .filter((value) => value && value.trim() !== "")
        .join(" ")
    : "선택된 주 활동 지역이 없습니다.";

  return (
    <div css={s.section}>
      <h3>주 활동 지역</h3>

      <div css={s.buttonRow}>
        <button type="button" css={s.addButton} onClick={handleOpenAddressSearch}>
          주소 찾기
        </button>

        <button type="button" css={s.addButton} onClick={handleSelectNone}>
          취소
        </button>
      </div>

      <div css={s.selectedAddress}>{displayMainRegion}</div>

      <input
        css={s.detailAddressInput}
        type="text"
        placeholder="상세 주소 (선택) 예: 3층, ○○음악학원"
        value={mainRegion?.detailAddress ?? ""}
        onChange={handleChangeDetailAddress}
        disabled={!mainRegion}
      />
    </div>
  );
}

export default MainRegionField;
