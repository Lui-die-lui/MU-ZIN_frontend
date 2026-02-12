import { css } from "@emotion/react";
import { baseBtn } from "../RequestReservationView/styles";

export const section = css`
  display: grid;
  gap: 12px;
  margin-top: 20px;
`;

export const successBox = css`
  border: 1px solid #eee;
  border-radius: 14px;
  background: #fff;
  padding: 18px 14px;
  display: grid;
  gap: 10px;
  text-align: center;
`;

export const successTitle = css`
  font-size: 18px;
  font-weight: 900;
`;

export const successDesc = css`
  font-size: 14px;
  color: #666;
  line-height: 1.45;
`;

export const okBtn = css`
  ${baseBtn};
  border: none;
  background: #111;
  color: #fff;
  margin-top: 6px;
`;