/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import { openDaumAddressSearch } from "../../../../../utils/openDaumAddressSearchUtils";
import { normalizeRegion1DepthName } from "../../../../../utils/regionUtils";

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
          const normalizedRegion1 = normalizeRegion1DepthName(
            selectedRegion.region1DepthName,
          );

          setField("mainRegion", {
            ...selectedRegion,
            region1DepthName: normalizedRegion1,
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
      <div css={s.sectionHeader}>
        <h4 css={s.title}>스튜디오 주소</h4>
        <p css={s.desc}>
          실제 수업이 진행되는 대표 활동 지역을 등록하세요.
        </p>
      </div>

      <div css={s.buttonRow}>
        <button
          type="button"
          css={s.outlineButton}
          disabled={disabled}
          onClick={handleOpenAddressSearch}
        >
          주소 찾기
        </button>

        {mainRegion && (
          <button
            type="button"
            css={s.ghostButton}
            disabled={disabled}
            onClick={handleSelectNone}
          >
            주소 삭제
          </button>
        )}
      </div>

      <div css={s.addressBox(Boolean(mainRegion))}>
        {displayMainRegion}
      </div>

      <input
        css={s.detailAddressInput}
        type="text"
        placeholder="상세 주소 예: 3층, ○○음악학원"
        value={mainRegion?.detailAddress ?? ""}
        onChange={handleChangeDetailAddress}
        disabled={disabled || !mainRegion}
      />
    </div>
  );
}

export default MainRegionField;