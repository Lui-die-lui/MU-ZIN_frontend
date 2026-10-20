import styled from "@emotion/styled";

// 배경·창·머리말·닫기는 공용 모달과 같은 모양
export { Overlay, Modal, Header, Title, CloseBtn } from "../CommonModal/styles";

// 크롭되는 영역 (차콜 바탕)
export const CropArea = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  background: #17191c;

  @media (max-width: 600px) {
    height: min(360px, 56dvh);
  }
`;

export const Controls = styled.div`
  display: grid;
`;

// 버튼 공간 - 공용 모달 하단과 같은 띠
export const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 24px 18px;
  border-top: 1px solid #eeede8;
  background: #faf9f6;

  @media (max-width: 600px) {
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
    & > button {
      flex: 1 1 0;
    }
  }
`;
