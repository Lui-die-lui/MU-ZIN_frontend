// 메인 3D 악기 이미지 - 목록은 레슨 카드와 같이 쓰려고 constants/instrumentArt 에 둠
import { INSTRUMENT_ART, instrumentSrc, type InstrumentArt } from "../../constants/instrumentArt";

export type HomeInstrument = InstrumentArt;
export const INSTRUMENTS = INSTRUMENT_ART;
export { instrumentSrc };

// 들어올 때마다 대표 악기 하나 + 겹치지 않는 나머지 몇 개 (한 번만 계산)
export const pickInstruments = (extra: number) => {
  const pool = [...INSTRUMENTS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return { hero: pool[0], others: pool.slice(1, 1 + extra) };
};

// 라벨 장식: 악기 이름으로 정해지는 바코드 무늬와 숫자 (무작위 아님 -> 다시 그려도 같음)
const hash = (key: string) => {
  let h = 2166136261;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

// 라벨 길이 단계: 이름이 짧으면 바코드·숫자도 짧게 (라벨이 내용에 맞게 줄어듦)
//   2글자(드럼·기타·보컬) 바코드 40px · 숫자 4자리 / 3글자 50px · 7자리 / 4글자 이상(바이올린) 60px · 8자리
// 같은 단계는 바코드 폭이 같아서 라벨 크기가 들쭉날쭉하지 않음
const labelTier = (name: string) => (name.length <= 2 ? 0 : name.length === 3 ? 1 : 2);
const TIER_WIDTH = [40, 50, 60];
const TIER_DIGITS = [4, 7, 8]; // "880 " 뒤 자리 수

export const labelCode = (key: string, name: string) => {
  const digits = String(hash(key)).padStart(10, "0").slice(-TIER_DIGITS[labelTier(name)]);
  return `880 ${digits.slice(0, 4)}${digits.length > 4 ? ` ${digits.slice(4)}` : ""}`;
};

// 바코드 막대 목록 (x, 굵기, 정수 px) - SVG 로 그림
export const barcodeBars = (key: string, name: string) => {
  const width = TIER_WIDTH[labelTier(name)];
  let h = hash(key);
  const bars: { x: number; w: number }[] = [{ x: 0, w: 1 }]; // 왼쪽 가는 기준 막대
  let x = 2;
  // 막대(1~3px)와 빈칸(1~2px)을 번갈아, 오른쪽 끝 기준 막대 자리(2px)는 남김
  while (true) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const w = 1 + (h % 3);
    if (x + w > width - 2) break;
    bars.push({ x, w });
    x += w + 1 + ((h >>> 3) % 2);
  }
  bars.push({ x: width - 1, w: 1 }); // 오른쪽 가는 기준 막대
  return { bars, width };
};
