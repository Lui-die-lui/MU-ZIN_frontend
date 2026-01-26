import { useMemo } from "react";
import type { TimeSlotResp } from "../../../../../Types/lessonTypes";
import TimeSlotCreatePanel from "../common/TimeSlots/TimeSlotCreatePanel/TimeSlotCreatePanel";
import TimeSlotSelectedList from "../common/TimeSlots/TimeSlotSelectedList/TimeSlotSelectedList";
import { uniqSortIsoLocal } from "../../../../../utils/timeSlotUtils";

type Props = {
  durationMin: number;
  serverSlots: TimeSlotResp[]; // 서버에서 불러온 기존 타임슬롯

  // 로컬 추가 예정
  draftStartDts: string[];

  onAdd: (dtLocal: string) => void;
  onAddMany: (dts: string[]) => void;
  // 서버  슬롯 삭제
  onRemoveServer: (timeSlotId: number) => void;
  // 로컬 추가분 삭제
  onRemoveDraft: (dt: string) => void;
  onClearDraft: () => void;
};
function EditLessonTimeSlotSection({
  durationMin,
  serverSlots,
  draftStartDts,
  onAdd,
  onAddMany,
  onRemoveServer,
  onRemoveDraft,
  onClearDraft,
}: Props) {
  // 서버 StartDt만 뽑기
  const serverStartDts = useMemo(
    () => serverSlots.map((s) => s.startDt),
    [serverSlots],
  );

  // 화면에는 서버 + 로컬 (추가예정) 합쳐서 보여주고 관리하게 됨
  const mergedStartDts = useMemo(() => {
    return uniqSortIsoLocal([...serverStartDts, ...draftStartDts]);
  }, [serverStartDts, draftStartDts]);

  // 삭제 클릭 시 서버 슬롯이면 서버 삭제, 아니면 로컬 삭제(화면에서만)
  const onRemoveMerged = (dt: string) => {
    const serverSlot = serverSlots.find((s) => s.startDt === dt);
    if (serverSlot) {
      onRemoveServer(serverSlot.timeSlotId);
      return;
    }
    onRemoveDraft(dt);
  };

  // 전체 삭제: 현재 정책 상 로컬 추가예정만 전체 삭제
  const onClearMerged = () => {
    onClearDraft();
  };

  return (
    <>
      <TimeSlotCreatePanel
        durationMin={durationMin}
        onAdd={onAdd}
        onAddMany={onAddMany}
      />
      <hr style={{ margin: "20px 0" }} />
      <TimeSlotSelectedList
        startDts={mergedStartDts}
        onRemove={onRemoveMerged}
        onClear={onClearMerged}
      />
    </>
  );
}

export default EditLessonTimeSlotSection;
