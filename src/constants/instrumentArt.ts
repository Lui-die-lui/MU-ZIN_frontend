// 3D 악기 이미지 (public/images/instruments) - 메인 배너 · 검색 화면 상단 판의 비닐 포장 악기
// inst.png 시트에서 악기별로 잘라 채도를 낮추고, 드럼·기타의 빨강은 검정으로 바꿈
export type InstrumentArt = { key: string; name: string; alt: string };

export const INSTRUMENT_ART: readonly InstrumentArt[] = [
  { key: "piano", name: "피아노", alt: "피아노" },
  { key: "guitar", name: "기타", alt: "기타" },
  { key: "drum", name: "드럼", alt: "드럼" },
  { key: "violin", name: "바이올린", alt: "바이올린" },
  { key: "flute", name: "플루트", alt: "플루트" },
  { key: "saxophone", name: "색소폰", alt: "색소폰" },
  { key: "trumpet", name: "트럼펫", alt: "트럼펫" },
  { key: "vocal", name: "보컬", alt: "마이크" },
  { key: "gayageum", name: "가야금", alt: "가야금" },
];

export const instrumentSrc = (key: string) => `/images/instruments/${key}.png`;
