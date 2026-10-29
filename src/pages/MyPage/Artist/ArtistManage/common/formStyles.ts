import { css } from "@emotion/react";
import { dropdownField } from "../../../../../components/common/dropdownStyles";

// 레슨 생성/수정 화면 공통 폼 디자인 (마이페이지 계정 화면과 같은 카드·글자 톤)

export const card = css`
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  padding: 24px;
  text-align: left;

  @media (max-width: 600px) {
    padding: 18px 16px;
    border-radius: 16px;
  }
`;

export const cardHeader = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
`;

export const cardTitle = css`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #111827;
`;

export const cardDesc = css`
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
`;

export const fields = css`
  display: grid;
  gap: 24px;
  text-align: left; /* 가운데 정렬 부모(레슨 만들기 화면) 안에서도 라벨/안내 문구 왼쪽 정렬 */
`;

// 두 칸 배치 (모바일에선 한 칸)
export const row2 = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const field = css`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const labelRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const label = css`
  font-size: 13px;
  font-weight: 600;
  color: #3f444a;
`;

export const required = css`
  margin-left: 2px;
  color: #dc2626;
`;

export const counter = css`
  font-size: 12px;
  color: #9ca3af;
`;

export const input = (invalid = false) => css`
  ${dropdownField};
  width: 100%;
  padding: 0 13px;
  ${invalid && "border-color: #dc2626;"}
`;

export const textarea = (invalid = false) => css`
  ${dropdownField};
  width: 100%;
  height: auto;
  min-height: 96px;
  padding: 12px 13px;
  line-height: 1.6;
  resize: vertical;
  ${invalid && "border-color: #dc2626;"}
`;

// 오른쪽에 단위(분, 원)가 붙는 입력칸
export const suffixWrap = css`
  position: relative;

  input {
    padding-right: 40px;
  }
`;

export const suffix = css`
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  font-size: 14px;
  color: #6b7280;
  pointer-events: none;
`;

export const helper = css`
  margin: 0;
  font-size: 12px;
  color: #6b7280;
`;

export const error = css`
  margin: 0;
  font-size: 12px;
  color: #dc2626;
`;

// 잠긴 항목 안내 (예약 진행 중)
export const lockNote = css`
  margin: 0;
  font-size: 12px;
  color: #1b1d20;
`;
