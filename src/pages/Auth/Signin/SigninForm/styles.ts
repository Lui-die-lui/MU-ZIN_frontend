import { css } from "@emotion/react";

export const formWrap = css`
  width: 100%;
  max-width: 405px;
  margin: 32px auto 0;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const form = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const submitButton = css`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 12px;
  background-color: #111827;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-sizing: border-box;
`;
export const errorMsg = css`
  margin: -4px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
`;


export const signupArea = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
`;

export const signupText = css`
  font-size: 14px;
  color: #6b7280;
`;

export const signupButton = css`
  border: none;
  background: none;
  padding: 0;
  font-size: 14px;
  font-weight: 700;
  color: #4f8cff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;


export const oauthArea = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: -6px;
`;