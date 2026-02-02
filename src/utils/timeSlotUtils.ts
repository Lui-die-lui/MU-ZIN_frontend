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

// 날짜/문자열 util
export const MAX_DAYS_AHEAD = 90;

// 숫자를 2자리 문자열로 맞춤 (1 = 01, 12 = 12)
// 날짜/시간 문자열 만들때 일관성 때문에
const pad2 = (n: number) => String(n).padStart(2, "0");

export function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function addDaysYmd(ymd: string, days: number) {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function toLocalDateTimeString(ymd: string, hm: string) {
  const hh = hm.slice(0, 2);
  const mm = hm.slice(3, 5);
  return `${ymd}T${hh}:${mm}:00`;
}

export function parseHm(dt: string) {
  return dt.slice(11, 16);
}

export function uniqSortIsoLocal(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b)); // 이게 뭐지
}

// 반복 생성

// 시간을 숫자로 바꿔야 비교/반복/증가 계산이 정확하고 간단함
// 시간 범위 안에서 슬롯을 여러 개 찍기 등등 시간 계산 해야하는 것들이 많아서 차라리 분으로 환산해서 계산 해버리기
const hmToMinutes = (hm: string) =>
  // HH 부분과 MM 부분을 잘라옴
  Number(hm.slice(0, 2)) * 60 + Number(hm.slice(3, 5));

export function generateRecurrenceStartDts(params: {
  fromYmd: string; // 시작 날짜
  toYmd: string; // 종료 날짜
  daysOfWeek: boolean[]; // 길이 7 배열 - 켤 요일이 true(백엔드에서 bit로 값 저장중)
  startTime: string; // 하루 시간 범위
  endTime: string;
  intervalMin: number; // 몇 분 간격으로 슬롯을 찍을지
  durationMin: number; // 레슨 수업 시간
}) {
  const {
    fromYmd,
    toYmd,
    daysOfWeek,
    startTime,
    endTime,
    intervalMin,
    durationMin,
  } = params;

  if (intervalMin <= 0)
    throw new Error("수업 준비 시간은 1분 이상이어야 합니다.");
  if (durationMin <= 0) throw new Error("수업 시간은 1분 이상이어야 합니다.");

  // 0  = 초기값(initial)이라는 뜻
  const startMin0 = hmToMinutes(startTime); // 시작 시간을 분으로 반환
  const endLimitMin = hmToMinutes(endTime); // 종료 시간을 분으로 반환
  if (endLimitMin <= startMin0)
    throw new Error("종료 시간은 시작시간 이후여야 합니다.");

  const today = todayYmd();
  const maxYmd = addDaysYmd(today, MAX_DAYS_AHEAD);
  const effectiveToYmd = toYmd > maxYmd ? maxYmd : toYmd;

  // 종료 날짜도 똑같이 Date로 만듦
  // 날짜 문자열을 Date로 바꿔서 하루씩 증가 + 루프
  // 로컬 자정이라는것을 더 확실하게 잡음

  // fromYmd = "2026-01-22"
  // "2026-01-22T00:00:00"로 만들어서
  // from = “2026년 1월 22일 0시 0분” Date 객체로 하루씩 증가시키는 루프 가능
  const from = new Date(fromYmd + "T00:00:00");
  const to = new Date(effectiveToYmd + "T00:00:00");

  // NaN = Not a Number - 숫자가 아닌 다른 이상한 값이 들어오면 그냥 빈 배열 return
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return [];

  // 결과로 반환할 startDts 배열
  // "YYYY-MM-DDTHH:mm:ss" 문자열이 담김
  const out: string[] = [];

  // 날짜 루프 - from부터 to 까지 하루씩 증가
  // 원본 변경 방지를 위해 from을 d로 복사해서 씀
  // 기간 내 모든 날짜를 하루 단위로 훑기
  for (
    let d = new Date(from);
    d.getTime() <= to.getTime();
    d.setDate(d.getDate() + 1)
  ) {
    // 현재 날짜 d를 "YYYY-MM-DD" 문자열로 다시 만듦
    // getMonth()는 0q부터 시작이라 +1
    // pad2로 2자리 맞춤
    const ymd = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    // 요일 구하기 (나중에 백엔드랑 맞게 매핑해줘야함)
    const w = d.getDay();

    // 사용자가 체크한 요일이 아니면 스킵
    if (!daysOfWeek[w]) continue;

    // 하루 안에서 여러 슬롯을 찍는 루프
    // 시작 시간을 부능로 관리할 변수
    // 시작 시점은 startTime이니까 startMin0으로 시작
    let curMin = startMin0;

    while (true) {
      if (curMin + durationMin > endLimitMin) break;

      // 총 분을 다시 HH:mm으로 변환
      // 분으로 계산된 값을 시간 / 분으로 다시 맞춰줌
      const hm = `${pad2(Math.floor(curMin / 60))}:${pad2(curMin % 60)}`;
      // 합쳐서 "YYYY-MM-DDTHH:mm:ss" 로 만들고 결과 배열에 넣음
      out.push(toLocalDateTimeString(ymd, hm));

      // 진행 시간 + 쉬는시간 = 수업진행 후 쉬는시간까지 합쳐서 timeslot chip을 생성
      const stepMin = durationMin + intervalMin;

      // 다음 슬롯 시작시간으로 이동
      // 예: intervalMin=90이면 10:30 → 12:00 → 13:30
      curMin += stepMin;

      // 시작 시간이 endTime 이상이면 종료
      if (curMin >= endLimitMin) break;
    }
  }
  return out;
}

export function toDowMask(daysOfWeek: boolean[]) {
  if (!Array.isArray(daysOfWeek) || daysOfWeek.length !== 7) {
    throw new Error("daysOfWeek는 길이 7배열이어야 합니다.");
  }

  let mask = 0;
  if (daysOfWeek[1]) mask |= 1;
  if (daysOfWeek[2]) mask |= 2;
  if (daysOfWeek[3]) mask |= 4;
  if (daysOfWeek[4]) mask |= 8;
  if (daysOfWeek[5]) mask |= 16;
  if (daysOfWeek[6]) mask |= 32;
  if (daysOfWeek[0]) mask |= 64;
  return mask;
}

