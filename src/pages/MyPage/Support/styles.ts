import { css } from "@emotion/react";

const ink = "#111827";
const text = "#1b1d20";
const mutedColor = "#6b7280";
const line = "#e2e5e9";

// 목록·카드·버튼은 레슨 문의 화면과 같은 값
export {
  page,
  header,
  title,
  desc,
  list,
  item,
  itemHead,
  content,
  reply,
  replyLabel,
  textarea,
  actions,
  btn,
  muted,
  error,
  stateBox,
  textBtn,
  srOnly,
} from "../Inquiries/styles";

export const sectionTitle = css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${text};
`;

export const form = css`
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid ${line};
  border-radius: 14px;
  background: #fff;
`;

export const fieldset = css`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    padding: 0;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: ${mutedColor};
  }
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

// 유형 선택 (라디오를 알약 모양으로)
export const chip = (on: boolean) => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  border: 1px solid ${on ? ink : "#cfd4da"};
  border-radius: 999px;
  background: ${on ? ink : "#fff"};
  color: ${on ? "#fff" : text};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  &:focus-within {
    outline: 3px solid rgba(17, 24, 39, 0.15);
    outline-offset: 1px;
  }
`;

export const formFoot = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const counter = css`
  font-size: 12px;
  color: ${mutedColor};
  font-variant-numeric: tabular-nums;
`;

export const meta = css`
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;

  strong {
    font-size: 14px;
    font-weight: 600;
    color: ${text};
  }
  span {
    font-size: 12px;
    color: ${mutedColor};
  }
`;

export const status = (answered: boolean) => css`
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid ${answered ? ink : line};
  background: ${answered ? ink : "#f3f4f6"};
  color: ${answered ? "#fff" : text};
  font-size: 12px;
  font-weight: 600;
`;
