/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LessonStatus, MyLessonDetail } from "../../../../../Types/lessonTypes";
import { updateMyLessonReq } from "../../../../../apis/lesson/lessonApis";
import { lessonKeys } from "../../../../../hooks/Lesson/useLessonEdit";
import { artistKeys } from "../../../../../hooks/artistSearch/artistKeys";
import { toast } from "../../../../../stores/useToastStore";
import MyLessonCard from "./MyLessonCard";

type Props = {
  lessons: MyLessonDetail[]; // 필터/정렬이 끝난 목록
};

type ToggleVars = { lessonId: number; next: LessonStatus };

function MyLessonList({ lessons }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listKey = lessonKeys.myList();

  // 여러 레슨을 연달아 토글해도 각자 진행 상태를 갖도록 id 집합으로 관리
  // (예전엔 마지막 토글 하나만 추적 + 화면용 상태와 캐시를 이중으로 관리했음)
  const [togglingIds, setTogglingIds] = useState<Set<number>>(() => new Set());
  const setToggling = (id: number, on: boolean) =>
    setTogglingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const toggleMut = useMutation({
    mutationFn: ({ lessonId, next }: ToggleVars) => updateMyLessonReq(lessonId, { status: next }),

    // 클릭 즉시 캐시에 반영 (실패하면 onError 에서 되돌림)
    onMutate: async ({ lessonId, next }) => {
      setToggling(lessonId, true);
      await qc.cancelQueries({ queryKey: listKey });
      const prev = qc.getQueryData<MyLessonDetail[]>(listKey);
      qc.setQueryData<MyLessonDetail[]>(listKey, (old) =>
        old?.map((l) => (l.lessonId === lessonId ? { ...l, status: next } : l)),
      );
      return { prev };
    },

    onSuccess: (_data, { lessonId, next }) => {
      const lesson = qc.getQueryData<MyLessonDetail[]>(listKey)?.find((l) => l.lessonId === lessonId);
      if (next === "INACTIVE") {
        toast.success("비공개로 바꿨어요. 이미 들어온 예약은 그대로 진행돼요.");
      } else if (lesson?.closingPolicy === "AUTO_CLOSE_WHEN_NO_SLOTS" && lesson.upcomingOpenSlotCount === 0) {
        toast.warning("공개로 바꿨지만 예약 가능한 시간이 없어 검색에는 아직 보이지 않아요. 시간을 추가해주세요.");
      } else {
        toast.success("공개로 바꿨어요. 이제 검색에 보여요.");
      }
    },

    // 실패 메시지는 전역 에러 토스트가 보여줌 - 여기서는 화면만 되돌림
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(listKey, ctx.prev);
    },

    onSettled: (_data, _err, vars) => {
      setToggling(vars.lessonId, false);
      // 내 목록/상세 + 공개 검색 결과 모두 서버 기준으로 다시 맞춤 (["lessons"] 아래 전부)
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: artistKeys.all }); // 공개 아티스트 화면의 레슨 카드
    },
  });

  return (
    <div css={s.list}>
      {lessons.map((l) => {
        const isToggling = togglingIds.has(l.lessonId);
        return (
          <MyLessonCard
            key={l.lessonId}
            lesson={l}
            isToggling={isToggling}
            onOpen={() => navigate(`/mypage/artist/manage/${l.lessonId}`)}
            onOpenRequests={() => navigate("/mypage/reservations/requests")}
            onToggleStatus={(next) => {
              if (isToggling) return; // 처리 중 중복 클릭 방지
              toggleMut.mutate({ lessonId: l.lessonId, next });
            }}
          />
        );
      })}
    </div>
  );
}

export default MyLessonList;
