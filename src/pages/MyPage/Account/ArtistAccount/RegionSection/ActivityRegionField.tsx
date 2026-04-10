import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";

function ActivityRegionField() {
  const mainRegion = useArtistApplyFormStore((s) => s.mainRegion);
  const setField = useArtistApplyFormStore((s) => s.setField);

  const handleSelectNone = () => {
    setField("mainRegion", null);
  };
  return (
    <div>
      <h3>주 활동 지역</h3>

      <button type="button">주소 검색</button>

      <button type="button" onClick={handleSelectNone}>
        없음
      </button>

      <div>{mainRegion?.addressLabel ?? "선택된 주 활동 지역이 없습니다."}</div>
    </div>
  );
}

export default ActivityRegionField;
