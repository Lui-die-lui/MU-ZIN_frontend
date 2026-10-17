/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useState } from "react";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import SelectedChips from "../../../../../components/common/SelectedChips/SelectedChips";
import { useRegionSelector } from "../../../../../hooks/region/useRegionSelector";
import InputDropdown from "../../../../../components/common/InputDropdown/InputDropdown";

const MAX_REGIONS = 5; // 서버도 같은 제한

type Region = { region1DepthName: string; region2DepthName: string | null; region3DepthName: string | null };

const regionKey = (r: Region) => [r.region1DepthName, r.region2DepthName ?? "", r.region3DepthName ?? ""].join("|");
const regionLabel = (r: Region) => [r.region1DepthName, r.region2DepthName, r.region3DepthName].filter(Boolean).join(" ");

type Props = {
  disabled?: boolean;
  onEdit?: () => void;
  hideHeader?: boolean; // 바깥에서 제목을 보여줄 때 (아티스트 프로필 행)
};

// 서비스 가능 지역 (방문/출장 레슨 가능 지역) - 아티스트 프로필 / 아티스트 신청 화면 공용
function ServiceRegionField({ disabled = false, onEdit, hideHeader = false }: Props) {
  const serviceRegions = useArtistApplyFormStore((s) => s.serviceRegions);
  const setField = useArtistApplyFormStore((s) => s.setField);
  // 예전엔 alert 창으로 안내 -> 칸 아래 문구로
  const [notice, setNotice] = useState<string | null>(null);

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

  const full = serviceRegions.length >= MAX_REGIONS;

  const handleAddRegion = () => {
    if (disabled) return;
    setNotice(null);
    if (full) {
      setNotice(`서비스 지역은 최대 ${MAX_REGIONS}개까지 등록할 수 있어요.`);
      return;
    }
    if (!validateAll()) return;
    const nextItem = buildRegionItem();
    if (!nextItem) return;

    if (serviceRegions.some((r) => regionKey(r) === regionKey(nextItem))) {
      setNotice(`'${regionLabel(nextItem)}'은(는) 이미 추가된 지역이에요.`);
      return;
    }
    setField("serviceRegions", [...serviceRegions, nextItem]);
    resetInputs();
    onEdit?.();
  };

  const handleRemoveRegion = (target: Region) => {
    if (disabled) return;
    setNotice(null);
    setField("serviceRegions", serviceRegions.filter((r) => regionKey(r) !== regionKey(target)));
    onEdit?.();
  };

  return (
    <div css={s.section}>
      {!hideHeader && (
        <div css={s.sectionHeader}>
          <h4 css={s.title}>
            서비스 가능 지역
            <span css={s.countBadge}>
              {serviceRegions.length}/{MAX_REGIONS}
            </span>
          </h4>
          <p css={s.desc}>방문·출장 레슨이 가능한 지역이에요. 시/도만 골라도 되고, 동까지 좁혀도 돼요.</p>
        </div>
      )}

      <div css={s.regionInputRow}>
        <div css={s.fieldItem}>
          <InputDropdown
            value={sidoInput}
            options={sidoOptions}
            placeholder="시/도"
            loading={isSidoLoading}
            disabled={disabled || full}
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
            placeholder="시/군/구 (선택)"
            loading={isSigunguLoading}
            disabled={disabled || full || !selectedSido}
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
            placeholder="읍/면/동 (선택)"
            loading={isEmdLoading}
            disabled={disabled || full || !selectedSigungu}
            error={!!emdError}
            helperText={emdError}
            onChange={handleChangeEmd}
            onSelect={handleSelectEmd}
            onBlur={validateEmd}
          />
        </div>
        <button type="button" css={s.addButton} disabled={disabled || full} onClick={handleAddRegion}>
          추가
        </button>
      </div>

      {notice && (
        <p css={s.noticeText} role="status">
          {notice}
        </p>
      )}
      {full && !notice && <p css={s.hintText}>최대 {MAX_REGIONS}개를 모두 채웠어요. 바꾸려면 기존 지역을 먼저 빼주세요.</p>}

      {serviceRegions.length === 0 ? (
        <p css={s.emptyText}>아직 등록한 지역이 없어요.</p>
      ) : (
        <div css={s.chipArea}>
          <SelectedChips
            items={serviceRegions}
            disabled={disabled}
            getKey={regionKey}
            getLabel={regionLabel}
            onRemove={handleRemoveRegion}
            title="눌러서 빼기"
          />
        </div>
      )}
    </div>
  );
}

export default ServiceRegionField;
