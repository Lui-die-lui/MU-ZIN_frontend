/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import { openDaumAddressSearch } from "../../../../../utils/openDaumAddressSearchUtils";

type Props = {
  disabled?: boolean;
};

function MainRegionField({ disabled = false }: Props) {
  const mainRegion = useArtistApplyFormStore((s) => s.mainRegion);
  const setField = useArtistApplyFormStore((s) => s.setField);

  const handleSelectNone = () => {
    if (disabled) return;
    setField("mainRegion", null);
  };

  const handleOpenAddressSearch = async () => {
    if (disabled) return;

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

    if (!mainRegion || disabled) return;

    setField("mainRegion", {
      ...mainRegion,
      detailAddress: value || null,
    });
  };

  const displayMainRegion = mainRegion
    ? [mainRegion.addressLabel, mainRegion.detailAddress]
        .filter((value) => value && value.trim() !== "")
        .join(" ")
    : "개인 스튜디오 및 학원이 있을 시 주소를 등록해주세요.";

  return (
    <div css={s.section}>
      <h3>스튜디오 주소</h3>

      <div css={s.buttonRow}>
        <button
          type="button"
          css={s.addButton}
          disabled={disabled}
          onClick={handleOpenAddressSearch}
        >
          주소 찾기
        </button>

        <button
          type="button"
          css={s.addButton}
          disabled={disabled}
          onClick={handleSelectNone}
        >
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
        disabled={disabled || !mainRegion}
      />
    </div>
  );
}

export default MainRegionField;
