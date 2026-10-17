import styled from "@emotion/styled";

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
export const Modal = styled.div<{ width?: number }>`
  width: ${({ width }) =>
    width
      ? `min(${width}px, calc(100vw - 24px))`
      : "min(520px, calc(100vw - 24px))"};
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  /* 내용이 길어도 화면 안에 들어오게: 본문만 스크롤, 아래 버튼은 항상 보임 */
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 32px);
`;

// 제목 및 취소 아이콘
export const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px 20px;
`;

// props 내 제목
export const Title = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 900;
`;

// 닫기 버튼
export const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  font-size: 15px;
  border-radius: 50px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
`;

// 바디 영역
// 예전: 높이 360px 고정 + 넘치는 내용을 가리지 않아서, 내용이 길면 아래 버튼 위로 겹쳐 버튼을 누를 수 없었음
//       (예약 상세의 "요청 취소하기"·"레슨 취소하기"가 눌리지 않던 원인). 짧은 확인 창은 빈 공간이 크게 남았음
export const Body = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 4px 20px 20px;
  overflow-y: auto;
  box-sizing: border-box;
  line-height: 1.6;
`;

// 버튼 공간
export const Footer = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px 18px;
  border-top: 1px solid #f0f1f2;
`;
