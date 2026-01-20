// import React from "react";

export function normalizeLocalDateTime(dtLocal: string) {
  // dtLocal:"YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss"
  if (!dtLocal) return ""; // 입력값이 비었으면 "" 반환

  // LocalDateTime에 타임존(Z, +09:00 등)이 섞이면 파싱 이슈/시간밀림 위험 → 방지
  if (dtLocal.includes("Z") || /[+-]\d{2}:\d{2}$/.test(dtLocal)) {
    throw new Error("LocalDateTime에는 타임존(Z/+09:00)을 포함하지 마세요.");
  }

  return dtLocal.length === 16 ? `${dtLocal}:00` : dtLocal;
  // 길이 16이면 "YYYY-MM-DDTHH:mm" 패턴(초 없음)이 거의 확정 그래서 뒤에 00 붙여줌
}

// // 같은 시간 중복 추가
// // 추가 순서 제멋대로일 수 있는 점을 감안해서 만듦
// export function addStartDt(
//   setter: React.Dispatch<React.SetStateAction<string[]>>,
//   dtLocal: string,
// ) {
//   const v = normalizeLocalDateTime(dtLocal);
//   if (!v) return;

//   setter((prev) => {
//     const next = Array.from(new Set([...prev, v])); // 중복 제거
//     next.sort(); // 문자열 정렬 = 시간 정렬(ISO 포맷) 문자열 비교 순서가 곧 날짜/시간 순서
//     return next;
//   });
// }

// export function removeStartDt(
//   setter: React.Dispatch<React.SetStateAction<string[]>>,
//   dt: string,
// ) {
//   setter((prev) => prev.filter((x) => x !== dt));
//   // 배열에서 dt랑 같은 값 하나를 빼고 나머지를 다시 setState 한다.
//   // 원래 배열에서 - 삭제하려는 dt랑 다른것만 남기고 - 조건을 만족하는 것만 남겨서 새 배열을 만든다
// }

export function addStartDtPure(prev: string[], dtLocal: string) {
  const v = normalizeLocalDateTime(dtLocal);
  if (!v) return prev;

  const next = Array.from(new Set([...prev, v])); // 중복 제거
  next.sort(); // ISO 포맷 문자열은 정렬 = 시간순
  return next;
}

export function removeStartDtPure(prev: string[], dt: string) {
  return prev.filter((item) => item !== dt);
}

// 타임슬롯 추가 시 과거 시간 생성 불가 함수
export function getMinLocalDateTime(minutesAhead = 1) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutesAhead);
  d.setSeconds(0, 0);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
