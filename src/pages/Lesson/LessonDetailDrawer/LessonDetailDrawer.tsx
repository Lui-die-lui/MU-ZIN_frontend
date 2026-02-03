/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { usePublicLessonDetail } from "../../../hooks/usePublicLessonDetail";
import SideDrawer from "../../../components/common/SideDrawer/SideDrawer";
import { useEffect, useMemo, useState } from "react";
import ArtistHeader from "./ArtistHeader";
import DetailTimeFilterPanel from "./DetailTimeFilterPanel/DetailTimeFilterPanel";
import Accordion from "../../../components/common/Accordion/Accordion";
import {
  EMPTY_OPEN_SLOT_FILTER,
  type OpenSlotFilter,
} from "../../../Types/searchForTimeTypes";
import LessonTimeSlotSection from "./LessonTimeSlotSection/LessonTimeSlotSection";
import { hasTimeFilter } from "../LessonSearch/SearchTimeFilter/hasTimeFilter";

export type Props = {
  open: boolean;
  lessonId: number | null;
  onClose: () => void;
  initialOpenSlotFilter?: OpenSlotFilter | null;
};

function LessonDetailDrawer({
  open,
  lessonId,
  onClose,
  initialOpenSlotFilter = null, // lessonId 없으면 렌더 요청 하지않기
}: Props) {
  const id = lessonId ?? 0;
  const { data, isLoading, isError } = usePublicLessonDetail(id);

  // 적용된 필터
  const [appliedTime, setAppliedTime] = useState<OpenSlotFilter | null>(
    EMPTY_OPEN_SLOT_FILTER,
  );

  //   // 아코디언 open 상태
  const [openIds, setOpenIds] = useState<string[]>([]);

  // 레슨이 바뀌면 필터/아코디언 상태도 초기화
  useEffect(() => {
    if (!lessonId) return;
    setAppliedTime(initialOpenSlotFilter); // 검색에서 넘어온 값 세팅
    setOpenIds(hasTimeFilter(initialOpenSlotFilter) ? ["time-filter"] : []);
  }, [lessonId, initialOpenSlotFilter]);

    const accordionItems = useMemo(
      () => [
        {
          id: "time-filter",
          title: "시간/요일/기간",
          content: (
            <DetailTimeFilterPanel
              initial={appliedTime}
              onApply={(next) => {
                setAppliedTime(next); // next: OpenSlotFilter | null
                // setOpenIds([]);         // 적용 후 자동으로 접고 싶으면 이거 켜도 됨
              }}
            />
          ),
        },
      ],
      [appliedTime],
    );

  return (
    <SideDrawer open={open} onClose={onClose} title="레슨 상세" width={440}>
      {isLoading && <div css={s.stateText}>로딩중...</div>}
      {isError && <div css={s.stateText}>불러오기 실패</div>}

      {data && lessonId != null && (
        <div css={s.wrap}>
          <ArtistHeader artist={data.artist} />

          <h2 css={s.title}>{data.title}</h2>

          <div css={s.metaRow}>
            <div>가격: {data.price ?? "문의"}</div>
            <div>시간: {data.durationMin}분</div>
          </div>

          {data.description && <div css={s.section}>{data.description}</div>}
          {data.requirementText && (
            <div css={s.section}>{data.requirementText}</div>
          )}

           <div css={s.bleedX(14)}>
            <Accordion
              items={accordionItems}
              allowMultiple={false}
              openIds={openIds}
              onChangeOpenIds={setOpenIds}
            />
          </div>

          {/* 타임슬롯 섹션 */}
          <div css={s.section}>
            <LessonTimeSlotSection
              lessonId={lessonId}
              filter={appliedTime}
              onClickReserve={(timeSlotId) => {
                // 여기서 drawer view 전환(detail -> reserve) 또는 예약 drawer 열기
                // setView("reserve"); setReserveTimeSlotId(timeSlotId) 같은 식
                console.log("reserve timeSlotId:", timeSlotId);
              }}
            />
          </div>
        </div>
      )}
    </SideDrawer>
  );
}
export default LessonDetailDrawer;
