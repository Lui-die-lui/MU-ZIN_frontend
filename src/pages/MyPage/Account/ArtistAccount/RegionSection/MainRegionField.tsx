/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import { openDaumAddressSearch } from "../../../../../utils/openDaumAddressSearchUtils";
import { normalizeRegion1DepthName } from "../../../../../utils/regionUtils";
import { toast } from "../../../../../stores/useToastStore";

// 서버 컬럼 길이와 같음 (artist_profile.detail_address varchar(120))
const DETAIL_MAX = 120;

type Props = {
  disabled?: boolean;
  detailError?: string; // 화면에서 넘겨주는 검증 메시지
  onEdit?: () => void; // 값이 바뀔 때 (오류 표시 지우기 등)
  hideHeader?: boolean; // 바깥에서 제목을 보여줄 때 (아티스트 프로필 행)
};

// 스튜디오(대표 활동) 주소 - 아티스트 프로필 / 아티스트 신청 화면 공용
function MainRegionField({ disabled = false, detailError, onEdit, hideHeader = false }: Props) {
  const mainRegion = useArtistApplyFormStore((s) => s.mainRegion);
  const setField = useArtistApplyFormStore((s) => s.setField);

  const handleRemove = () => {
    if (disabled) return;
    setField("mainRegion", null);
    onEdit?.();
  };

  const handleOpenAddressSearch = async () => {
    if (disabled) return;
    try {
      await openDaumAddressSearch({
        onSelect: (selectedRegion) => {
          setField("mainRegion", {
            ...selectedRegion,
            region1DepthName: normalizeRegion1DepthName(selectedRegion.region1DepthName),
            detailAddress: mainRegion?.detailAddress ?? null,
          });
          onEdit?.();
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("주소 검색 창을 열지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleChangeDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mainRegion || disabled) return;
    setField("mainRegion", { ...mainRegion, detailAddress: e.target.value || null });
    onEdit?.();
  };

  const detail = mainRegion?.detailAddress ?? "";

  return (
    <div css={s.section}>
      {!hideHeader && (
        <div css={s.sectionHeader}>
          <h4 css={s.title}>스튜디오 주소</h4>
          <p css={s.desc}>학원·개인 스튜디오처럼 직접 수업하는 곳이 있으면 등록하세요. 없으면 비워둬도 돼요.</p>
        </div>
      )}

      {mainRegion ? (
        <div css={s.addressCard}>
          <div css={s.addressMain}>
            <span css={s.addressText}>{mainRegion.addressLabel ?? mainRegion.roadAddress ?? "주소"}</span>
            <div css={s.buttonRow}>
              <button type="button" css={s.outlineButton} disabled={disabled} onClick={handleOpenAddressSearch}>
                주소 변경
              </button>
              <button type="button" css={s.ghostButton} disabled={disabled} onClick={handleRemove}>
                삭제
              </button>
            </div>
          </div>
          <div css={s.detailRow}>
            <input
              css={s.detailAddressInput(!!detailError)}
              type="text"
              placeholder="상세 주소 (예: 3층, ○○음악학원)"
              aria-label="상세 주소"
              value={detail}
              maxLength={DETAIL_MAX}
              onChange={handleChangeDetail}
              disabled={disabled}
            />
            <span css={s.counter}>
              {detail.length}/{DETAIL_MAX}
            </span>
          </div>
          {detailError && (
            <p css={s.errorText} role="alert">
              {detailError}
            </p>
          )}
        </div>
      ) : (
        <button type="button" css={s.emptyAddress} disabled={disabled} onClick={handleOpenAddressSearch}>
          <span>등록된 주소가 없어요</span>
          <b>+ 주소 찾기</b>
        </button>
      )}
    </div>
  );
}

export default MainRegionField;
