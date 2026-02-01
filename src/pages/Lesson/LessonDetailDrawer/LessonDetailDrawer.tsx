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

export type Props = {
  open: boolean;
  lessonId: number | null;
  onClose: () => void;
};
function LessonDetailDrawer({ open, lessonId, onClose }: Props) {
  const id = lessonId ?? 0;
  const { data, isLoading, isError } = usePublicLessonDetail(id);

  // 적용된 필터
  const [appliedTime, setAppliedTime] = useState<OpenSlotFilter | null>(
    EMPTY_OPEN_SLOT_FILTER,
  );

  // 아코디언 open 상태
  const [openIds, setOpenIds] = useState<string[]>([]);

  // 레슨이 바뀌면 필터/아코디언 상태도 초기화
  useEffect(() => {
    setAppliedTime(null);
    setOpenIds([]);
  }, [lessonId]);

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

      {data && (
        <div css={s.wrap}>
          <ArtistHeader artist={data.artist} />

          {/* 레슨 정보 */}
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
        </div>
      )}
    </SideDrawer>
  );
}

export default LessonDetailDrawer;
