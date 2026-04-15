/** @jsxImportSource @emotion/react */
import InputDropdown from "../../../../components/common/InputDropdown/InputDropdown";
import type { ArtistSearchDraft } from "../../../../Types/artistSearchTypes";
import type { Option } from "../../../../Types/commonTypes";
import * as s from "./styles";
import { useRegionSelector } from "../../../../hooks/region/useRegionSelector";

type Props = {
  draft: ArtistSearchDraft;
  onChangeDraft: (
    updater: (prev: ArtistSearchDraft) => ArtistSearchDraft,
  ) => void;
};

function RegionSearchInput({ draft, onChangeDraft }: Props) {
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
  } = useRegionSelector();

  const handleSelectRegion1 = (option: Option<number>) => {
    handleSelectSido(option);

    onChangeDraft((prev) => ({
      ...prev,
      region1DepthName: option.label,
      region2DepthName: "",
      region3DepthName: "",
    }));
  };

  const handleSelectRegion2 = (option: Option<number>) => {
    handleSelectSigungu(option);

    onChangeDraft((prev) => ({
      ...prev,
      region2DepthName: option.label,
      region3DepthName: "",
    }));
  };

  const handleSelectRegion3 = (option: Option<number>) => {
    handleSelectEmd(option);

    onChangeDraft((prev) => ({
      ...prev,
      region3DepthName: option.label,
    }));
  };

  return (
    <div css={s.layout}>
      <InputDropdown
        value={sidoInput}
        options={sidoOptions}
        placeholder="시/도"
        loading={isSidoLoading}
        error={!!sidoError}
        helperText={sidoError}
        onChange={handleChangeSido}
        onSelect={handleSelectRegion1}
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
        onSelect={handleSelectRegion2}
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
        onSelect={handleSelectRegion3}
      />
    </div>
  );
}

export default RegionSearchInput;
