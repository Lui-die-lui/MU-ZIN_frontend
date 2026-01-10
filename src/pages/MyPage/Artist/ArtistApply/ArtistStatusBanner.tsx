/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { ArtistStatus } from "../../../../Types/auth";

type Props = {
  status: ArtistStatus;
};

export function ApplyStatusBanner({ status }: Props) {
  const msg = (() => {
    switch (status) {
      case "NONE":
        return {
          title: "아티스트 전환 신청서",
          desc: "프로필을 작성하고 임시 저장 후, 제출하면 심사가 시작돼요.",
        };
      case "PENDING":
        return {
          title: "심사 진행 중",
          desc: "현재 심사 중이라 신청서를 수정할 수 없어요.",
        };
      case "APPROVED":
        return {
          title: "승인 완료",
          desc: "이미 아티스트로 승인된 계정이에요.",
        };
      case "REJECTED":
        return {
          title: "반려됨",
          desc: "내용을 수정한 뒤 다시 제출할 수 있어요.",
        };
      default:
        return { title: "상태 확인", desc: "" };
    }
  })();

  return (
    <div css={wrap}>
      <div css={title}>{msg.title}</div>
      {msg.desc && <div css={desc}>{msg.desc}</div>}
    </div>
  );
}

export default ApplyStatusBanner;

const wrap = css`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const title = css`
  font-size: 14px;
  font-weight: 800;
`;

const desc = css`
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
`;