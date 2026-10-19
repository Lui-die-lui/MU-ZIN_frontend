import { css } from "@emotion/react";

// 관리자 화면 공용 (문의 화면과 같은 카드·버튼 값)
const ink = "#111827";
const text = "#1b1d20";
const mutedColor = "#6b7280";
const line = "#e2e5e9";

export { page, header, title, desc } from "../MyPage/Reviews/styles";
export {
  list,
  item,
  itemHead,
  who,
  content,
  textarea,
  actions,
  btn,
  muted,
  error,
  stateBox,
  textBtn,
  srOnly,
} from "../MyPage/Inquiries/styles";

export const pill = (tone: "strong" | "plain" | "dark" | "danger") => css`
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid ${tone === "strong" ? ink : tone === "danger" ? "#f1b8b2" : line};
  background: ${tone === "dark" ? ink : tone === "danger" ? "#fdf0ef" : tone === "strong" ? "#fff" : "#f3f4f6"};
  color: ${tone === "dark" ? "#fff" : tone === "danger" ? "#b42318" : text};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

export const pills = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

// 신청 상세 (전공 / 악기 / 소개 / 경력 ...)
export const detail = css`
  display: grid;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  background: #f7f8f9;
`;

export const field = css`
  display: grid;
  gap: 4px;

  > span {
    font-size: 12px;
    font-weight: 800;
    color: ${mutedColor};
  }
  > p {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: ${text};
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

export const rejectBox = css`
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border-left: 3px solid #b42318;
  border-radius: 0 10px 10px 0;
  background: #fdf0ef;

  strong {
    font-size: 13px;
  }
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

export const form = css`
  display: grid;
  gap: 8px;
`;

export const input = css`
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #cfd4da;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;

  &:focus {
    outline: 3px solid rgba(17, 24, 39, 0.1);
    border-color: ${ink};
  }
`;

export const searchRow = css`
  display: flex;
  gap: 8px;

  > input {
    flex: 1;
    min-width: 0;
  }
`;

export const pager = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  color: ${mutedColor};
`;

export const meta = css`
  margin: 0;
  font-size: 12px;
  color: ${mutedColor};
  overflow-wrap: anywhere;
`;
