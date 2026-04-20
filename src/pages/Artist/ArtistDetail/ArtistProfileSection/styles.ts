import { css } from "@emotion/react";

export const container = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const topBox = css`
  display: flex;
  gap: 28px;
  padding: 28px;
  border: 1px solid #e6eaf0;
  border-radius: 24px;
  background-color: #fff;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    gap: 20px;
  }
`;

export const imageWrap = css`
  flex-shrink: 0;
`;

export const profileImage = css`
  width: 140px;
  height: 140px;
  border-radius: 20px;
  object-fit: cover;
  background-color: #f3f5f7;

  @media (max-width: 768px) {
    width: 112px;
    height: 112px;
  }
`;

export const infoWrap = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const headerRow = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const identityBlock = css`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const nameAndMajorGroup = css`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px 12px;
`;

export const username = css`
  margin: 0;
  font-size: 30px;
  line-height: 1.2;
  font-weight: 700;
  color: #111827;
`;

export const major = css`
  margin: 0;
  font-size: 15px;
  line-height: 1.4;
  color: #667085;
`;

export const mainRegion = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #475467;
  word-break: keep-all;
`;

export const locationIcon = css`
  flex-shrink: 0;
  font-size: 13px;
  transform: translateY(-1px);
`;

export const editButton = css`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d0d7de;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  color: #344054;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    border-color: #bfc8d4;
  }
`;

export const metaList = css`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const metaSection = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const metaLabel = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
  color: #344054;
`;

export const tagRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 8px;
  align-items: center;
`;

const baseChip = css`
  display: inline-flex;
  align-items: center;
  min-height: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
`;

export const instrumentChip = css`
  ${baseChip};
  background-color: #f2f4f7;
  color: #111827;
`;

export const styleChip = css`
  ${baseChip};
  background-color: #eef4ff;
  color: #1d4f91;
`;

export const serviceRegionChip = css`
  ${baseChip};
  background-color: #e7ffe9;
  color: #1d6b35;
`;

export const emptyText = css`
  font-size: 14px;
  line-height: 1.5;
  color: #98a2b3;
`;

export const bottomBox = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border: 1px solid #e6eaf0;
  border-radius: 20px;
  background-color: #fff;
`;

export const sectionBlock = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const sectionTitle = css`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

export const sectionText = css`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #344054;
  white-space: pre-line;
`;
