import styled from "@emotion/styled";

export const Wrap = styled.div`
  display: flex;
  min-height: 100dvh;
  background: #fff;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const Content = styled.main`
  flex: 1;
  min-width: 0;
  padding: 24px;

  @media (max-width: 900px) {
    padding: 16px;
  }
`;