/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { useNavigate } from "react-router-dom";
import type {
  LessonStatus,
  LessonSummary,
} from "../../../../../Types/lessonTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { updateMyLessonReq } from "../../../../../apis/lesson/lessonApis";
import { lessonKeys } from "../../../../../hooks/Lesson/useLessonEdit";
import MyLessonCard from "./MyLessonCard";

type Props = {
  loading: boolean;
  lesson: LessonSummary[];
  onClickLesson: (LessonId: number) => void;
};

// 토글시 넘겨줄 변수 목록들
type ToggleVars = { lessonId: number; next: LessonStatus };

function MyLessonList({ loading, lesson }: Props) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // 어떤 레슨이 토글 중인지
  const [togglingLessonId, setTogglingLessonId] = useState<number | null>(null);

  // ui 즉시 반영(서버 반영 전까지 임시 상태)
  const [uiStatusById, setUiStatusById] = useState<
    Record<number, LessonStatus>
  >({});

  // 빠른 lookup (useEffect에서 find 반복 줄이기)
  const serverStatusById = useMemo(() => {
    const map = new Map<number, LessonStatus>();
    for (const l of lesson) map.set(l.lessonId, l.status);
    return map;
  }, [lesson]);

  // 서버 데이터가 override를 따라오면 override 제거(깜빡임 및 불일치 방지)
  useEffect(() => {
    setUiStatusById((prev) => {
      let changed = false;
      const next = { ...prev };

      // 실제 객체 키가 문자열이라서 Number로 바꿔줘야함
      for (const [idStr, override] of Object.entries(next)) {
        const id = Number(idStr);
        const server = serverStatusById.get(id);

        // 목록에서 사라졌거나, 서버가 같은 상태로 따라왔으면 제거
        if (!server || server === override) {
          delete next[id];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [serverStatusById]);

  const toggleMut = useMutation({
    mutationFn: async ({ lessonId, next }: ToggleVars) => {
      await updateMyLessonReq(lessonId, { status: next });
    },

    onMutate: ({ lessonId }) => {
      // 시작 - 토글 중 표시만
      setTogglingLessonId(lessonId);
    },

    onError: (_err, { lessonId }) => {
      // 실패 시 override 제거 -> 서버 상태로 복귀
      setUiStatusById((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
    },

    onSettled: (_data, _err, vars) => {
      setTogglingLessonId(null);

      // 내 목록 + 해당 디테일은 서버기준으로 동기화
      qc.invalidateQueries({ queryKey: lessonKeys.myList() });
      if (vars) {
        qc.invalidateQueries({ queryKey: lessonKeys.myDetail(vars.lessonId) });
      }
      // 공개 검색/디테일도 같이 최신화 시켜줌
      qc.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
  if (loading) {
    return (
      <div css={s.list}>
        <div css={s.skeleton} />
        <div css={s.skeleton} />
        <div css={s.skeleton} />
      </div>
    );
  }

  if (!lesson.length) {
    return (
      <div css={s.empty}>
        <div css={s.emptyTitle}>아직 레슨이 없습니다.</div>
      </div>
    );
  }

  return (
    <div css={s.list}>
      {lesson.map((l) => {
        const effectiveStatus = uiStatusById[l.lessonId] ?? l.status;
        const isToggling =
          togglingLessonId === l.lessonId && toggleMut.isPending;

        return (
          <MyLessonCard
            key={l.lessonId}
            lesson={l}
            status={effectiveStatus}
            onClick={() => {
              // 토글 중에는 상세 진입 막기(실수 방지)
              if (!isToggling) navigate(`/mypage/artist/manage/${l.lessonId}`);
            }}
            onToggleStatus={(next) => {
              // ✅ 토글 중 중복 클릭 방지
              if (isToggling) return;

              // ✅ 클릭 즉시 UI 반영
              setUiStatusById((prev) => ({ ...prev, [l.lessonId]: next }));

              // 서버 반영
              toggleMut.mutate({ lessonId: l.lessonId, next });
            }}
            isToggling={isToggling}
          />
        );
      })}
    </div>
  );
}

export default MyLessonList;
