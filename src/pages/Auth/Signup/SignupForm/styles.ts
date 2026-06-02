import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const ErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #e11d48;
`;

export const form = css`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
`;

export const formWrap = css`
  width: 100%;
  max-width: 420px;
  margin: 80px auto 0;
  padding: 0 20px;
`;

export const submitButton = css`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  background-color: #111827;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;
