import { css } from "@emotion/react";

export const section = css`
  width: 100%;
`;

export const sectionHeader = css`
  margin-bottom: 24px;
`;

export const sectionTitle = css`
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
`;

export const sectionDesc = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #6b7280;
`;

export const content = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const fieldGroup = css`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const labelArea = css`
  padding-top: 9px;

  @media (max-width: 640px) {
    padding-top: 0;
  }
`;

export const label = css`
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #111827;
`;

export const labelDesc = css`
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: #9ca3af;
`;

export const inputArea = css`
  min-width: 0;
`;

export const input = css`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font-size: 14px;
  box-sizing: border-box;

  &:read-only {
    background: #f9fafb;
    color: #6b7280;
    cursor: default;
  }

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

export const textarea = css`
  width: 100%;
  min-height: 112px;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;

  &::placeholder {
    color: #b6bdc7;
  }

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

export const helperText = css`
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: #9ca3af;
`;

export const divider = css`
  width: 100%;
  height: 1px;
  margin: 4px 0;
  background: #e5e7eb;
`;

export const regionBlock = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;


export const actionRow = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
`;

export const saveButton = (disabled: boolean) => css`
  min-width: 96px;
  height: 38px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  background: ${disabled ? "#c4c4c4" : "#050505"};
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  cursor: ${disabled ? "not-allowed" : "pointer"};
  transition:
    background 140ms ease,
    transform 140ms ease;

  &:hover {
    transform: ${disabled ? "none" : "translateY(-1px)"};
  }
`;

export const statusText = css`
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
`;
