/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import SelectedChips from "../../../../../components/common/SelectedChips/SelectedChips";
import { useRegionSelector } from "../../../../../hooks/region/useRegionSelector";
import InputDropdown from "../../../../../components/common/InputDropdown/InputDropdown";

type Props = {
  disabled?: boolean;
};

function ServiceRegionField({ disabled = false }: Props) {
  const serviceRegions = useArtistApplyFormStore((s) => s.serviceRegions);
  const setField = useArtistApplyFormStore((s) => s.setField);

  const {
    sidoInput,
    sigunguInput,
    emdInput,

    selectedSido,
    selectedSigungu,

    sidoOptions,
    sigunguOptions,
    emdOptions,

    isSidoLoading,
    isSigunguLoading,
    isEmdLoading,

    sidoError,
    sigunguError,
    emdError,

    handleChangeSido,
    handleChangeSigungu,
    handleChangeEmd,

    handleSelectSido,
    handleSelectSigungu,
    handleSelectEmd,

    validateSido,
    validateSigungu,
    validateEmd,
    validateAll,

    buildRegionItem,
    resetInputs,
  } = useRegionSelector();

  const handleAddRegion = () => {
    if (disabled) return;

    const isValid = validateAll();
    if (!isValid) return;

    const nextItem = buildRegionItem();
    if (!nextItem) return;

    if (serviceRegions.length >= 5) {
      alert("최대 5개까지 지정 가능합니다.");
      return;
    }

    const isDuplicate = serviceRegions.some(
      (region) =>
        region.region1DepthName === nextItem.region1DepthName &&
        (region.region2DepthName ?? null) ===
          (nextItem.region2DepthName ?? null) &&
        (region.region3DepthName ?? null) ===
          (nextItem.region3DepthName ?? null),
    );
    if (isDuplicate) {
      alert("이미 추가된 지역입니다.");
      return;
    }

    setField("serviceRegions", [...serviceRegions, nextItem]);
    resetInputs();
  };

  const handleRemoveRegion = (target: {
    region1DepthName: string;
    region2DepthName: string | null;
    region3DepthName: string | null;
  }) => {
    if (disabled) return;

    const next = serviceRegions.filter(
      (region) =>
        !(
          region.region1DepthName === target.region1DepthName &&
          (region.region2DepthName ?? null) ===
            (target.region2DepthName ?? null) &&
          (region.region3DepthName ?? null) ===
            (target.region3DepthName ?? null)
        ),
    );

    setField("serviceRegions", next);
  };

  return (
    <div css={s.section}>
      <h4>서비스 가능 지역</h4>

      <div css={s.regionInputRow}>
        <div css={s.fieldItem}>
          <InputDropdown
            value={sidoInput}
            options={sidoOptions}
            placeholder="시/도"
            loading={isSidoLoading}
            disabled={disabled}
            error={!!sidoError}
            helperText={sidoError}
            onChange={handleChangeSido}
            onSelect={handleSelectSido}
            onBlur={validateSido}
          />
        </div>

        <div css={s.fieldItem}>
          <InputDropdown
            value={sigunguInput}
            options={sigunguOptions}
            placeholder="시/군/구"
            loading={isSigunguLoading}
            disabled={disabled || !selectedSido}
            error={!!sigunguError}
            helperText={sigunguError}
            onChange={handleChangeSigungu}
            onSelect={handleSelectSigungu}
            onBlur={validateSigungu}
          />
        </div>

        <div css={s.fieldItem}>
          <InputDropdown
            value={emdInput}
            options={emdOptions}
            placeholder="읍/면/동"
            loading={isEmdLoading}
            disabled={disabled || !selectedSigungu}
            error={!!emdError}
            helperText={emdError}
            onChange={handleChangeEmd}
            onSelect={handleSelectEmd}
            onBlur={validateEmd}
          />
        </div>

        <button
          type="button"
          css={s.addButton}
          disabled={disabled}
          onClick={handleAddRegion}
        >
          지역 추가
        </button>
      </div>

      {serviceRegions.length === 0 ? (
        <p css={s.emptyText}>선택된 서비스 지역이 없습니다.</p>
      ) : (
        <SelectedChips
          items={serviceRegions}
          getKey={(region) =>
            [
              region.region1DepthName,
              region.region2DepthName,
              region.region3DepthName,
            ]
              .filter(Boolean)
              .join("-")
          }
          getLabel={(region) =>
            [
              region.region1DepthName,
              region.region2DepthName,
              region.region3DepthName,
            ]
              .filter(Boolean)
              .join(" ")
          }
          onRemove={handleRemoveRegion}
          title="클릭 시 삭제"
        />
      )}

      <p css={s.countText}>{serviceRegions.length}/5</p>
    </div>
  );
}

export default ServiceRegionField;
