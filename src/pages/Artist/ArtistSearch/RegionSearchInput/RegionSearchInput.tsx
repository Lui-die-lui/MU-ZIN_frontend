/** @jsxImportSource @emotion/react */
import InputDropdown from "../../../../components/common/InputDropdown/InputDropdown";
import type { ArtistSearchDraft } from "../../../../Types/artistSearchTypes";
import type { Option } from "../../../../Types/commonTypes";
import * as s from "./styles";
import { useRegionSelector } from "../../../../hooks/region/useRegionSelector";
import {
  getCurrentPosition,
  resolveRegionFromCoords,
} from "../../../../utils/regionUtils";
import { useEffect } from "react";
import type { RegionSearchValue } from "../../../../Types/artistRegionTypes";

type Props = {
  // draft: ArtistSearchDraft;
  value: RegionSearchValue;
  // onChangeDraft: (
  //   updater: (prev: ArtistSearchDraft) => ArtistSearchDraft,
  // ) => void;
  onChange: React.Dispatch<React.SetStateAction<RegionSearchValue>>;
};

function RegionSearchInput({ value, onChange }: Props) {
  const {
    sidoInput,
    sigunguInput,
    emdInput,

    selectedSido,
    selectedSigungu,
    selectedEmd,

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

    clearSido,
    clearSigungu,
    clearEmd,
  } = useRegionSelector({
    region1DepthName: value.region1DepthName,
    region2DepthName: value.region2DepthName,
    region3DepthName: value.region3DepthName,
  });

  useEffect(() => {
    if (!value.region1DepthName) return;
    if (!sidoOptions.length) return;
    if (selectedSido?.name === value.region1DepthName) return;

    const matchedSido = sidoOptions.find(
      (option) => option.label === value.region1DepthName,
    );

    if (matchedSido) {
      handleSelectSido(matchedSido);
    }
  }, [value.region1DepthName, sidoOptions, selectedSido, handleSelectSido]);

  useEffect(() => {
    if (!value.region2DepthName) return;
    if (!sigunguOptions.length) return;
    if (selectedSigungu?.name === value.region2DepthName) return;

    const matchedSigungu = sigunguOptions.find(
      (option) => option.label === value.region2DepthName,
    );

    if (matchedSigungu) {
      handleSelectSigungu(matchedSigungu);
    }
  }, [
    value.region2DepthName,
    sigunguOptions,
    selectedSigungu,
    handleSelectSigungu,
  ]);

  useEffect(() => {
    if (!value.region3DepthName) return;
    if (!emdOptions.length) return;
    if (selectedEmd?.name === value.region3DepthName) return;

    const matchedEmd = emdOptions.find(
      (option) => option.label === value.region3DepthName,
    );

    if (matchedEmd) {
      handleSelectEmd(matchedEmd);
    }
  }, [value.region3DepthName, emdOptions, selectedEmd, handleSelectEmd]);

  const handleSelectRegion1 = (option: Option<number>) => {
    handleSelectSido(option);

    onChange((prev) => ({
      ...prev,
      region1DepthName: option.label,
      region2DepthName: "",
      region3DepthName: "",
    }));
  };

  const handleSelectRegion2 = (option: Option<number>) => {
    handleSelectSigungu(option);

    onChange((prev) => ({
      ...prev,
      region2DepthName: option.label,
      region3DepthName: "",
    }));
  };

  const handleSelectRegion3 = (option: Option<number>) => {
    handleSelectEmd(option);

    onChange((prev) => ({
      ...prev,
      region3DepthName: option.label,
    }));
  };

  // 내 위치 가져오기
  const handleUseMyLocation = async () => {
    try {
      const position = await getCurrentPosition();

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const region = await resolveRegionFromCoords(latitude, longitude);

      clearEmd();

      onChange((prev) => ({
        ...prev,
        region1DepthName: region.region1DepthName ?? "",
        region2DepthName: region.region2DepthName ?? "",
        // region3DepthName: region.region3DepthName ?? "",
        region3DepthName: "",
      }));
    } catch (error) {
      console.error(error);
      alert("현재 위치를 가져오지 못했습니다.");
    }
  };

  return (
    <div css={s.layout}>
      <div css={s.locationButtonWrap}>
        <button
          type="button"
          css={s.locationButton}
          onClick={handleUseMyLocation}
        >
          현재 위치
        </button>
      </div>

      <InputDropdown
        value={sidoInput}
        options={sidoOptions}
        placeholder="시/도"
        loading={isSidoLoading}
        error={!!sidoError}
        helperText={sidoError}
        onChange={(value) => {
          onChange((prev) => ({
            ...prev,
            region1DepthName: value,
            region2DepthName: "",
            region3DepthName: "",
          }));
          handleChangeSido(value);
        }}
        onSelect={handleSelectRegion1}
      />

      <InputDropdown
        value={sigunguInput}
        options={sigunguOptions}
        placeholder="시/군/구"
        loading={isSigunguLoading}
        disabled={!selectedSido && !value.region1DepthName}
        error={!!sigunguError}
        helperText={sigunguError}
        onChange={(value) => {
          onChange((prev) => ({
            ...prev,
            region2DepthName: value,
            region3DepthName: "",
          }));
          handleChangeSigungu(value);
        }}
        onSelect={handleSelectRegion2}
      />

      <InputDropdown
        value={emdInput}
        options={emdOptions}
        placeholder="읍/면/동"
        loading={isEmdLoading}
        disabled={!selectedSigungu && !value.region2DepthName}
        error={!!emdError}
        helperText={emdError}
        onChange={(value) => {
          onChange((prev) => ({
            ...prev,
            region3DepthName: value,
          }));
          handleChangeEmd(value);
        }}
        onSelect={handleSelectRegion3}
      />
    </div>
  );
}

export default RegionSearchInput;
