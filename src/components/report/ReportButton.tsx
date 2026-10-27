/** @jsxImportSource @emotion/react */
import { useState } from "react";
import type { SerializedStyles } from "@emotion/react";
import * as s from "./styles";
import ReportModal from "./ReportModal";
import type { ReportTargetType } from "../../Types/adminTypes";
import { usePrincipalState } from "../../stores/usePrincipalState";

type Props = {
  targetType: ReportTargetType;
  targetId: number;
  targetName: string;
  targetUserId?: number; // 본인이면 숨김
  buttonCss?: SerializedStyles; // 기본은 작은 글자 버튼
  label?: string;
};

// 신고 버튼 + 신고 창. 로그인 안 했거나 본인 것이면 보이지 않음
function ReportButton({ targetType, targetId, targetName, targetUserId, buttonCss, label = "신고" }: Props) {
  const me = usePrincipalState((st) => st.principal?.userId);
  const [open, setOpen] = useState(false);
  if (!me || (targetUserId != null && targetUserId === me)) return null;

  return (
    <>
      <button type="button" css={buttonCss ?? s.textButton} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {label}
      </button>
      <ReportModal open={open} onClose={() => setOpen(false)} targetType={targetType} targetId={targetId} targetName={targetName} />
    </>
  );
}

export default ReportButton;
