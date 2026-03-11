import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const page = css`
  max-width: 760px;
  margin: 0 auto;
  padding: 30px 24px 80px;
`;

export const header = css`
  margin-bottom: 28px;
  text-align: left;
`;

export const title = css`
  font-size: 25px;
  font-weight: 700;
  margin: 0 0 8px;
`;

export const desc = css`
  font-size: 13px;
  color: #666;
  margin: 0;
`;

export const card = css`
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  overflow: hidden;
`;

export const SubContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ContentItem = styled.div`
  display: flex;
  align-items: center; /* 아이콘-글자 수직 정렬 */
  gap: 8px; /* 아이콘-글자 간격 */
`;

export const input = css`
  height: 34px;
  padding: 0 10px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background: #fff;
`;

export const reserveBtn = css`
  padding: 10px 12px;
  border-radius: 14px;
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const textarea = css`
  resize: none;
  min-height: 120px;
  max-height: 300px;
  min-width: 300px;
  max-width: 630px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background: #fff;
`;

export const userReserveBtn = css`
  width: 100%;
  height: 100%;
  border: none;
  /* border-left: 1px solid #ececec; */
  background: #2e2e2e;
  color: #fff;
  font-size: 15px;
  /* font-weight: 600; */
  cursor: pointer;

  &:disabled {
    background: #bdbdbd;
    color: #fff;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background: #181818;
  }
`;

// 라벨용 공용 css
export const labelWithIcon = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  line-height: 1;

  svg {
    flex-shrink: 0;
  }
`;

export const helperText = css`
  margin-top: 6px;
  font-size: 13px;
  color: #777;
`;

export const errorText = css`
  margin-top: 6px;
  font-size: 13px;
  color: #d93025;
`;

export const successText = css`
  margin-top: 6px;
  font-size: 13px;
  color: #2e7d32;
`;
