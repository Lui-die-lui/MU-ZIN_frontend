import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyTimeSlotsReq,
  getMyLessonDetailReq,
  getMyLessonRecurrenceReq,
  getMyLessonsReq,
  updateMyLessonReq,
  upsertMyLessonRecurrenceReq,
} from "../../apis/lesson/lessonApis";
import type {
  LessonRecurrenceUpsertReq,
  LessonSummary,
  LessonUpdateReq,
  TimeSlotCreateReq,
} from "../../Types/lessonTypes";
import {
  closeMyTimeSlotsReq,
  deleteMyTimeSlotsReq,
  getMyTimeSlotsReq,
  openMyTimeSlotsReq,
} from "../../apis/lesson/timeSlotApis";

// lesson Query key 통일
export const lessonKeys = {
  myDetail: (lessonId: number) => ["lessons", "me", lessonId] as const,
  myTimeSlots: (lessonId: number, from: string, to: string) =>
    ["lessons", "me", lessonId, "time-slots", from, to] as const,
  myRecurrence: (lessonId: number) =>
    ["lessons", "me", lessonId, "recurrence"] as const,
  myList: () => ["lessons", "me"] as const,
};

// 레슨 수정 페이지 접근 시 기존 레슨 데이터를 서버에서 가져와서 폼 기본 값으로 채움
export function useMyLessonDetail(lessonId: number) {
  return useQuery({
    queryKey: lessonKeys.myDetail(lessonId),
    queryFn: () =>
      getMyLessonDetailReq(lessonId).then((resp) => resp.data.data),
    enabled: Number.isFinite(lessonId) && lessonId > 0, // 유효한 숫자인지 검증
  });
}

// 저장 누를때 mutation
// invalidate(캐시 폐기) 하는 이유 - 이전 캐시를 보고있으면 x / 그래서 다시 읽고 불러오게 함
// query 를 건드릴때는 useQueryClient를 사용해야함
export function useUpdateMyLesson(lessonId: number) {
  const qc = useQueryClient(); // 이걸 밖으로 빼는건 규칙 위반임(반복돼서 빼서 쓰려고 했는데...)
  return useMutation({
    mutationFn: (body: LessonUpdateReq) =>
      updateMyLessonReq(lessonId, body).then((resp) => resp.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.myDetail(lessonId) });
      qc.invalidateQueries({ queryKey: lessonKeys.myList() });
    },
  });
}

// 수정 화면에서 슬롯 리스트 보여주고 booked 있는지 판단 후 레슨 핵심 필드 disable 함
export function useMyTimeSlots(lessonId: number, from: string, to: string) {
  return useQuery({
    queryKey: lessonKeys.myTimeSlots(lessonId, from, to),
    queryFn: () =>
      getMyTimeSlotsReq(lessonId, { from, to }).then((resp) => resp.data.data),
    enabled: Number.isFinite(lessonId) && lessonId > 0 && !!from && !!to, // 값 없을 때 호출 방지
  });
}

// 단일 추가 / 반복 계산 결과 추가 등
// 성공 후 timeslots 캐시만 버리면 충분함
export function useCreateMyTimeSlots(
  lessonId: number,
  from: string,
  to: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TimeSlotCreateReq) =>
      createMyTimeSlotsReq(lessonId, body).then((resp) => resp.data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: lessonKeys.myTimeSlots(lessonId, from, to),
      });
    },
  });
}

// 슬롯 open <-> close 토글용
// 토글 결과가 리스트에 반영돼야 하니까 슬롯 캐시만 invalidate
export function useToggleMyTimeSlot(
  lessonId: number,
  from: string,
  to: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { timeSlotId: number; next: "OPEN" | "CLOSED" }) => {
      return p.next === "CLOSED"
        ? closeMyTimeSlotsReq(p.timeSlotId)
        : openMyTimeSlotsReq(p.timeSlotId);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: lessonKeys.myTimeSlots(lessonId, from, to),
      });
    },
  });
}

// 슬롯 삭제 버튼 누르면 delete -> 성공 후 invalidate(삭제된 슬롯이 리스트에서 사라져야 하니까 최신 값으로 만들어줌)
export function useDeleteMyTimeSlot(
  lessonId: number,
  from: string,
  to: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (timeSlotId: number) => deleteMyTimeSlotsReq(timeSlotId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: lessonKeys.myTimeSlots(lessonId, from, to),
      });
    },
  });
}

// 반복 규칙을 서버에서 읽어와서 UI에 현재 설정 값을 보여줌
export function useMyRecurrence(lessonId: number) {
  return useQuery({
    queryKey: lessonKeys.myRecurrence(lessonId),
    queryFn: () =>
      getMyLessonRecurrenceReq(lessonId).then((resp) => resp.data.data),
    enabled: Number.isFinite(lessonId) && lessonId > 0,
    retry: false,
  });
}

// 반복 규칙 저장 + 백엔드 materialize로 슬롯 생성 정리 해줌.
// 그래서 성공시 캐시 최신화가 필요함.
// 반복 규칙(recurrence) 데이터 바뀜, materialize로 슬롯이 생기거나 바뀜
export function useUpsertMyRecurrence(
  lessonId: number,
  from: string,
  to: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LessonRecurrenceUpsertReq) =>
      upsertMyLessonRecurrenceReq(lessonId, body).then((resp) => resp.data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lessonKeys.myRecurrence(lessonId) });
      qc.invalidateQueries({
        queryKey: lessonKeys.myTimeSlots(lessonId, from, to),
      });
    },
  });
}

// 해당 토글은 서버 반영이 바로 되도록 함 - 다른 유저에게도 즉시 영향이 가야하는 부분이기 때문에
export function useToggleMyLessonStatus(
  lessonId: number,
  opts?: { from?: string; to?: string },
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (nextStatus: "ACTIVE" | "INACTIVE") =>
      updateMyLessonReq(lessonId, { status: nextStatus }).then(
        (resp) => resp.data.data,
      ),

    onSuccess: () => {
      // 내 레슨 디테일/리스트 최신화
      qc.invalidateQueries({ queryKey: lessonKeys.myDetail(lessonId) });
      qc.invalidateQueries({ queryKey: lessonKeys.myList() });

      // 상태 변경 시 슬롯 UI 바로 반영(해당 레슨 타임슬롯 전부 비활성화)
      // timeSlot 관련해서 비활성화 로직이 따로 있음
      const from = opts?.from;
      const to = opts?.to;
      if (from && to) {
        qc.invalidateQueries({
          queryKey: lessonKeys.myTimeSlots(lessonId, from, to),
        });
      }
    },
  });
}

// 내 레슨 목록을 가져오는 규칙 고정(any 방지)
// 캐시에 저장되는 데이터 형태를 LessonSummary로 통일(아니면 any 들어가게 됨)
export function useMyLessonList() {
  return useQuery({
    queryKey: lessonKeys.myList(),
    queryFn: async (): Promise<LessonSummary[]> => {
      const resp = await getMyLessonsReq();
      return resp.data.data; // 배열만 캐시 저장
    },
  });
}
