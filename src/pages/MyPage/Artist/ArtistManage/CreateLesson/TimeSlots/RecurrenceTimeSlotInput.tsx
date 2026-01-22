// from/to + 요일 + start/end + interval로 여러개 startDts를 미리 계산해서 추가
// 미리보기 개수 보여주기, 추가 누르면 onAdd

import { useMemo, useState } from "react";
import {
  addDaysYmd,
  generateRecurrenceStartDts,
  MAX_DAYS_AHEAD,
  todayYmd,
} from "../../../../../../utils/timeSlotUtils";

type Props = {
  durationMin: number; // createLesson에서 온 값
  onAddMany: (dts: string[]) => void;
};

function RecurrenceTimeSlotInput() {
  const today = todayYmd();
  // 오늘 날짜 + 최대 90일까지 생성
  const maxTo = useMemo(() => addDaysYmd(today, MAX_DAYS_AHEAD), [today]);

  const [fromYmd, setFromYmd] = useState(today);
  const [toYmd, setToYmd] = useState(maxTo);
  const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>([
    false,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [intervalMin, setIntervalMin] = useState(90);

  // 미리보기 - 계산된 startDts
//   const previewDts = useMemo{() => {
//     try {
//         return generateRecurrenceStartDts({
//            fromYmd,
//         toYmd,
//         daysOfWeek,
//         startTime,
//         endTime,
//         intervalMin,
//         durationMin,  
//         })
//     }
//   }}

  return <div></div>;
}

export default RecurrenceTimeSlotInput;
