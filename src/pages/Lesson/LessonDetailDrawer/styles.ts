import { css } from "@emotion/react";

// 레슨 상세 창 - 레슨 검색 화면과 같은 톤
const border = "#e2e5e9";
const text = "#1b1d20";
const muted = "#697078";

// 세로 간격: 큰 덩어리 사이 24px, 제목-내용 8px 로 통일
export const wrap = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: ${text};
  text-align: left;
`;

// ---------- 단계 표시 ----------
export const steps = css`
  display: flex;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const step = (current: boolean, done: boolean) => css`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  background: ${current ? text : done ? "#f0f1f2" : "#fafafa"};
  color: ${current ? "#fff" : done ? text : "#9aa0a6"};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  span {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${current ? "#fff" : done ? text : "#e5e7eb"};
    color: ${current ? text : done ? "#fff" : "#9aa0a6"};
    font-size: 11px;
  }
`;

// ---------- 아티스트 (레슨 검색에서 열었을 때) ----------
export const artistHeader = css`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${border};
  border-radius: 12px;
  background: #fff;
  font: inherit;
  cursor: pointer;
  text-align: left;

  &:hover {
    border-color: #aeb4bc;
  }

  &::after {
    content: "프로필 보기 →";
    flex-shrink: 0;
    margin-left: auto;
    white-space: nowrap;
    color: ${muted};
    font-size: 12px;
  }
`;

export const artistMeta = css`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const artistName = css`
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// ---------- 레슨 정보 ----------
export const title = css`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.02em;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const metaLine = css`
  margin: 8px 0 0;
  color: ${muted};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
`;

// 예약 요청 버튼 바로 위(아래 고정 영역) 안내 + 확인 체크 - 확인해야 버튼이 켜짐
export const noticeBox = css`
  display: grid;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f5f4f0;

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #17191c;
    word-break: keep-all;
  }
`;

export const noticeCheck = css`
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 8px;
  width: fit-content;
  font-size: 14px;
  font-weight: 700;
  color: #17191c;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: #17191c;
  }
`;


// 가격 아래 작은 안내 (결제 기능 없음)
export const requestFooter = css`
  display: grid;
  gap: 10px;
`;

export const priceNote = css`
  margin: 4px 0 0;
  color: ${muted};
  font-size: 12px;
  line-height: 1.5;
`;

export const infoBlock = css`
  display: grid;
  gap: 20px;
`;

export const blockTitle = css`
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: ${text};
`;

export const bodyText = css`
  margin: 0;
  color: #3b4045;
  font-size: 14px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

// ---------- 시간 선택 ----------
export const slotSection = css`
  display: grid;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f0f1f2;
`;

export const slotHeader = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  h3 {
    margin: 0;
  }
`;

// 시간대 필터 버튼 (작은 회색 버튼 + 아이콘, 조건이 걸려 있으면 검정 점)
export const filterToggle = (active: boolean) => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: ${active ? "#e9ebee" : "#f3f4f6"};
  color: ${text};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e9ebee;
  }

  svg {
    color: #4c5157;
  }
`;

export const filterDot = css`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${text};
`;

export const appliedChip = css`
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 6px;
  height: 30px;
  padding: 0 6px 0 12px;
  border: 1px solid ${text};
  border-radius: 8px;
  background: #fff;
  color: ${text};
  font-size: 13px;
  font-weight: 600;

  button {
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 6px;
    background: #f0f1f2;
    color: ${text};
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }
`;

// 상세 창 안에서만 검색 필터(SearchTimeFilter) 칩 모양을 시간 버튼과 같은 톤으로 맞춤 (검색 화면 디자인은 그대로)
export const filterBox = css`
  padding: 16px;
  border-radius: 12px;
  background: #f7f8f9;

  button[aria-pressed] {
    min-width: 40px;
    height: 34px;
    padding: 0 12px;
    border: 1px solid #eceef0;
    border-radius: 999px;
    background: #fff;
    color: ${text};
    font-size: 13px;
    font-weight: 600;
  }

  button[aria-pressed]:hover:not(:disabled),
  button[aria-pressed]:focus-visible {
    outline: none;
    border-color: #eceef0;
    background: #eef0f2;
  }

  button[aria-pressed="true"],
  button[aria-pressed="true"]:hover,
  button[aria-pressed="true"]:focus-visible {
    border-color: ${text};
    background: ${text};
    color: #fff;
  }

  input[type="date"] {
    height: 36px;
    border-radius: 8px;
  }
`;

// ---------- 아래 고정 영역 ----------
export const footerInner = css`
  display: grid;
  gap: 10px;
`;

export const footerInfo = css`
  display: grid;
  gap: 2px;
  font-size: 15px;
  color: ${text};
`;

export const footerLabel = css`
  font-size: 12px;
  font-weight: 700;
  color: ${muted};
`;

export const footerHint = css`
  font-size: 13px;
  color: ${muted};
`;

export const footerRow = css`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
`;

export const primaryBtn = css`
  height: 48px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  background: ${text};
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background: #e5e7eb;
    color: #9aa0a6;
    cursor: not-allowed;
  }
`;

export const ghostBtn = css`
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${border};
  border-radius: 12px;
  background: #fff;
  color: ${text};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const stateText = css`
  padding: 24px 4px;
  color: ${muted};
  font-size: 14px;
  line-height: 1.6;
`;

// 자동 비공개(예약 가능한 시간 없음) 안내
export const closedNotice = css`
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid #e2e5e9;
  border-radius: 14px;
  background: #f7f8f9;
  color: #1b1d20;
  font-size: 13px;
  line-height: 1.6;

  strong {
    font-size: 14px;
    color: #1b1d20;
  }
`;

// 제목 아래 별점 요약 (누르면 리뷰로 이동)
export const ratingLine = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 4px 8px 4px 6px;
  border: 0;
  border-radius: 8px;
  background: #f7f8f9;
  font: inherit;
  font-size: 13px;
  color: #1b1d20;
  cursor: pointer;

  span {
    color: #6b7280;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  &:hover {
    background: #eef0f2;
  }
`;

export const reviewSection = css`
  display: grid;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #eef0f2;
  scroll-margin-top: 12px;
`;
