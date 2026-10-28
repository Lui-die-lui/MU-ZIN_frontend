// 알림 안내를 봤는지 (실제 알림 권한·구독과는 별개)
//  - "확인했어요" 체크 후 완료: localStorage, 계정별 -> 이 브라우저에서 이 계정은 다시 자동으로 띄우지 않음
//    (브라우저 데이터를 지우거나 다른 기기·브라우저·홈 화면 앱에서는 다시 보임)
//  - 닫기·나중에: sessionStorage, 계정별 -> 이 탭을 닫기 전까지만 다시 띄우지 않음
const ackKey = (userId: number) => `muzin.pushGuide.ack.u${userId}`;
const laterKey = (userId: number) => `muzin.pushGuide.later.u${userId}`;

const get = (s: () => Storage, k: string) => {
  try {
    return s().getItem(k) === "1";
  } catch {
    return false;
  }
};
const set = (s: () => Storage, k: string) => {
  try {
    s().setItem(k, "1");
  } catch {
    // 저장이 막힌 브라우저(시크릿 창 등) - 이번 화면에서만 닫힘
  }
};

export const isGuideAcked = (userId: number) => get(() => localStorage, ackKey(userId));
export const ackGuide = (userId: number) => set(() => localStorage, ackKey(userId));
export const isGuideLater = (userId: number) => get(() => sessionStorage, laterKey(userId));
export const laterGuide = (userId: number) => set(() => sessionStorage, laterKey(userId));
