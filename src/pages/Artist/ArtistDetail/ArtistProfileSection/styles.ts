import { css } from "@emotion/react";

export const container = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const topBox = css`
  display: flex;
  gap: 24px;
  padding: 24px;
  border: 1px solid #e6eaf0;
  border-radius: 20px;
  background-color: #fff;

  @media (max-width: 768px) {
    flex-direction: column;
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
`;

export const infoWrap = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const titleRow = css`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
`;

export const titleGroup = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const username = css`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
`;

export const major = css`
  margin: 0;
  font-size: 16px;
  color: #667085;
`;

export const editButton = css`
  padding: 10px 14px;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
`;

export const metaSection = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const metaLabel = css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #344054;
`;

export const tagRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const instrumentChip = css`
  padding: 8px 12px;
  border-radius: 999px;
  background-color: #f2f4f7;
  font-size: 14px;
`;

export const styleChip = css`
  padding: 8px 12px;
  border-radius: 999px;
  background-color: #eef4ff;
  font-size: 14px;
`;

export const emptyText = css`
  font-size: 14px;
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