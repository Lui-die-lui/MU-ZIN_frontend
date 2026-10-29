import { css } from "@emotion/react";
import { faint, focusRing, ink, line, mist, paper, sub } from "../../constants/uiTone";

// 약관·처리방침 문서 - 읽기 편한 폭과 줄 간격 (메인 톤)
export const doc = css`
  display: grid;
  gap: 12px;
  color: ${ink};
  font-size: 15px;
  line-height: 1.75;
  word-break: keep-all;
  overflow-wrap: anywhere;
  text-align: left;
`;

export const h2 = css`
  margin: 28px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.45;
  scroll-margin-top: 80px;
`;

export const h3 = css`
  margin: 16px 0 0;
  font-size: 16px;
  font-weight: 600;
  scroll-margin-top: 80px;
`;

export const p = css`
  margin: 0;
  color: ${ink};
`;

export const list = css`
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 22px;

  & > li::marker {
    color: ${sub};
  }
`;

export const subList = css`
  display: grid;
  gap: 4px;
  margin: 6px 0 2px;
  padding-left: 18px;
  color: ${sub};
  list-style: disc;
`;

export const hr = css`
  width: 100%;
  margin: 24px 0 4px;
  border: 0;
  border-top: 1px solid ${line};
`;

export const tableWrap = css`
  overflow-x: auto;
  border-radius: 14px;
  background: #fff;
  box-shadow: inset 0 0 0 1px ${line};
`;

export const table = css`
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  font-size: 13px;
  line-height: 1.6;

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid ${line};
    text-align: left;
    vertical-align: top;
  }
  th {
    background: ${paper};
    font-weight: 600;
    white-space: nowrap;
  }
  tr:last-of-type td {
    border-bottom: 0;
  }
`;

export const link = css`
  color: ${ink};
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  border-radius: 4px;
  ${focusRing};
`;

// ---------- 페이지 틀 ----------

export const page = css`
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 8px 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 8px 0 16px;
  }
`;

export const header = css`
  display: grid;
  gap: 8px;
  margin-bottom: 8px;
  padding: 28px 32px;
  border-radius: 24px;
  background: ${paper};
  text-align: left;

  @media (max-width: 600px) {
    padding: 22px 20px;
    border-radius: 20px;
  }
`;

export const title = css`
  margin: 0;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${ink};
`;

export const meta = css`
  margin: 0;
  font-size: 13px;
  color: ${faint};
`;

export const otherDoc = css`
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  background: ${mist};
  color: ${ink};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  ${focusRing};
`;

export const body = css`
  padding: 8px 8px 0;

  @media (max-width: 600px) {
    padding: 4px 4px 0;
  }
`;
