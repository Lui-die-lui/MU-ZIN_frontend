import styled from "@emotion/styled";

// 마이페이지 · 관리자 틀: [사이드 메뉴 판 | 본문] (900px 이하는 가로 칩 줄 아래 본문)
// 좌우 24px = 상단 메뉴 로고와 같은 선
export const Wrap = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  min-height: calc(100dvh - 64px); /* 상단 메뉴(64px) 아래 */
  padding: 16px 24px 0;
  box-sizing: border-box;
  background: #fff;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0 16px;
  }
`;

export const Content = styled.main`
  flex: 1;
  min-width: 0;
  padding: 8px 0 48px;

  @media (max-width: 900px) {
    padding: 16px 0 40px;
  }
`;
