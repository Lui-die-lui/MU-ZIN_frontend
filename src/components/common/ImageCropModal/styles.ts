import styled from "@emotion/styled";
import { css } from "@emotion/react";

// 모달 뒤 명도 낮아지게 오버레이
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: grid;
  place-items: center;
  z-index: 9999;
`;

// 모달
export const Modal = styled.div`
  width: min(520px, calc(100vw - 24px));
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  /* border: 1px solid #e5e7eb; */
`;

// 제목 및 취소 아이콘
export const Header = styled.div`
  padding: 14px 16px;
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
  display: flex;
  justify-content: flex-end;
`;

// props 내 제목
// export const Title = styled.h2`
//   margin: 0;
//   font-size: 14px;
//   font-weight: 900;
// `;

// 닫기 버튼
export const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
`;

// 크롭되는 영역
export const CropArea = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  background: #0b0f1a;
`;

export const Controls = styled.div`
  padding: 14px 16px 16px;
  display: grid;
  gap: 12px;

  label {
    display: grid;
    gap: 8px;
    font-size: 12px;
    font-weight: 800;
    color: #374151;
  }
`;

// export const Range = styled.input`
//   width: 100%;
// `;

// 버튼 공간
export const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

// 버튼
export const Btn = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 900;
  cursor: pointer;
`;


// 저장 - 바로 반영 버튼
export const PrimaryBtn = styled(Btn)`
  background: #111827;
  color: #fff;
  border-color: #111827;

  &:disabled {
    background: #9ca3af;   /* gray-400 */
    border-color: #9ca3af;
    color: #ffffff;
  }
`;