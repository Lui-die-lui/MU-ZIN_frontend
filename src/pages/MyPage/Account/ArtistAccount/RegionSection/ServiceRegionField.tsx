import React, { useState } from "react";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import SelectedChips from "../../../../../components/common/SelectedChips/SelectedChips";
import type { ArtistServiceRegion } from "../../../../../Types/artistRegionTypes";
import { useRegionSelector } from "../../../../../hooks/region/useRegionSelector";
import InputDropdown from "../../../../../components/common/InputDropdown/InputDropdown";

function ServiceRegionField() {
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
    <div>
      <h4>서비스 가능 지역</h4>

      <div>
        <InputDropdown
          value={sidoInput}
          options={sidoOptions}
          placeholder="시/도"
          loading={isSidoLoading}
          error={!!sidoError}
          helperText={sidoError}
          onChange={handleChangeSido}
          onSelect={handleSelectSido}
          onBlur={validateSido}
        />

        <InputDropdown
          value={sigunguInput}
          options={sigunguOptions}
          placeholder="시/군/구"
          loading={isSigunguLoading}
          disabled={!selectedSido}
          error={!!sigunguError}
          helperText={sigunguError}
          onChange={handleChangeSigungu}
          onSelect={handleSelectSigungu}
          onBlur={validateSigungu}
        />

        <InputDropdown
          value={emdInput}
          options={emdOptions}
          placeholder="읍/면/동"
          loading={isEmdLoading}
          disabled={!selectedSigungu}
          error={!!emdError}
          helperText={emdError}
          onChange={handleChangeEmd}
          onSelect={handleSelectEmd}
          onBlur={validateEmd}
        />

        <button type="button" onClick={handleAddRegion}>
          지역 추가
        </button>
      </div>

      {serviceRegions.length === 0 ? (
        <p>선택된 서비스 지역이 없습니다.</p>
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

      <p>{serviceRegions.length}/5</p>
    </div>
  );
}

export default ServiceRegionField;
