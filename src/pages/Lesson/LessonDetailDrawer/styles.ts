import { css } from "@emotion/react";




export const wrap = css`
  display: flex;
  flex-direction: column;
`;

export const artistHeader = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const artistMeta = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const artistName = css`
  font-weight: 700;
`;

export const avatarCircle = css`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  overflow: hidden;

  background: #5a4038;
  display: grid;
  place-items: center;
`;


export const avatarImg = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const avatarFallback = css`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 700;
`;

export const title = css`
  margin: 4px 0 10px;
`;

export const metaRow = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
`;

export const section = css`
  margin-top: 10px;
  color: #223;
  line-height: 1.5;
`;

export const stateText = css`
  padding: 8px 2px;
  color: #667;
`;
