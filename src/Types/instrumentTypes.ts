// 악기 카테고리 enum
// export type InstrumentCategory = string;
// export type InstrumentCategory =
//   | "WOODWIND"
//   | "BRASS"
//   | "STRINGS"
//   | "KEYBOARD"
//   | "PERCUSSION"
//   | "KOREAN_TRADITIONAL"
//   | "VOCAL"
//   | "ETC";
export const INSTRUMENT_CATEGORIES = [
  "WOODWIND",
  "BRASS",
  "STRINGS",
  "KEYBOARD",
  "PERCUSSION",
  "KOREAN_TRADITIONAL",
  "VOCAL",
  "ETC",
] as const;

export type InstrumentCategory = (typeof INSTRUMENT_CATEGORIES)[number];

export const INST_CATEGORY_LABEL: Record<InstrumentCategory, string> = {
  WOODWIND: "목관",
  BRASS: "금관",
  STRINGS: "현악",
  KEYBOARD: "건반",
  PERCUSSION: "타악",
  KOREAN_TRADITIONAL: "국악기",
  VOCAL: "보컬/성악",
  ETC: "etc",
};

// Label -> enum (역매핑) 값을 백엔드로 보낼때 사용됨
export const INST_CATEGORY_VALUE_BY_LABEL: Record<string, InstrumentCategory> =
  {
    목관: "WOODWIND",
    금관: "BRASS",
    현악: "STRINGS",
    건반: "KEYBOARD",
    타악: "PERCUSSION",
    국악기: "KOREAN_TRADITIONAL",
    "보컬/성악": "VOCAL",
    etc: "ETC",
  };

export interface InstrumentResponse {
  instId: number;
  instName: string;
  category: InstrumentCategory;
}
