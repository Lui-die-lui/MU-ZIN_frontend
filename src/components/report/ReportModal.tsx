/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import CommonModal from "../common/CommonModal/CommonModal";
import { modalBtn } from "../common/CommonModal/modalButtons";
import { useCreateReport } from "../../hooks/report/useReport";
import { REPORT_DETAIL_MAX, REPORT_REASON_LABEL, type ReportReason, type ReportTargetType } from "../../Types/adminTypes";
import { getErrorMessage } from "../../utils/errorUtils";
import { toast } from "../../stores/useToastStore";

type Props = {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: number;
  targetName: string; // "OO님" 처럼 안내 문장에 들어감
};

const REASONS = Object.keys(REPORT_REASON_LABEL) as ReportReason[];

const WHAT: Record<ReportTargetType, string> = {
  ARTIST: "아티스트",
  CHAT_ROOM: "대화 상대",
  REVIEW: "리뷰",
  INQUIRY: "문의",
};

// 신고하기 - 사유 선택 + 내용(선택). 상대에게는 알리지 않고 관리자만 확인
function ReportModal({ open, onClose, targetType, targetId, targetName }: Props) {
  const reportM = useCreateReport();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (reportM.isPending) return;
    setReason(null);
    setDetail("");
    setError(null);
    onClose();
  };

  const submit = async () => {
    if (!reason) {
      setError("신고 사유를 선택해주세요.");
      return;
    }
    try {
      await reportM.mutateAsync({ targetType, targetId, reason, detail: detail.trim() || undefined });
      toast.success("신고가 접수됐어요. 관리자가 확인할게요.");
      close();
    } catch (e) {
      setError(getErrorMessage(e, "신고하지 못했어요."));
    }
  };

  return (
    <CommonModal
      open={open}
      title={`${WHAT[targetType]} 신고`}
      onClose={close}
      footer={
        <>
          <button type="button" css={modalBtn("secondary")} onClick={close} disabled={reportM.isPending}>
            취소
          </button>
          <button type="button" css={modalBtn("danger")} onClick={submit} disabled={reportM.isPending}>
            {reportM.isPending ? "보내는 중..." : "신고하기"}
          </button>
        </>
      }
    >
      <p css={s.lead}>
        <strong>{targetName}</strong>
        {targetType === "CHAT_ROOM" && "님이 보낸 최근 메시지가 함께 전달돼요. "}
        {targetType !== "CHAT_ROOM" && " 내용이 함께 전달돼요. "}
        신고한 사실은 상대에게 알리지 않아요.
      </p>

      <fieldset css={s.reasons}>
        <legend css={s.legend}>신고 사유</legend>
        {REASONS.map((r) => (
          <label key={r} css={s.reason(reason === r)}>
            <input
              type="radio"
              name="report-reason"
              value={r}
              checked={reason === r}
              onChange={() => {
                setReason(r);
                setError(null);
              }}
            />
            {REPORT_REASON_LABEL[r]}
          </label>
        ))}
      </fieldset>

      <label htmlFor="report-detail" css={s.legend}>
        자세한 내용 (선택)
      </label>
      <textarea
        id="report-detail"
        css={s.textarea}
        rows={3}
        maxLength={REPORT_DETAIL_MAX}
        placeholder="어떤 점이 문제였는지 적어주시면 확인에 도움이 돼요."
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />

      {error && (
        <p role="alert" css={s.error}>
          {error}
        </p>
      )}
    </CommonModal>
  );
}

export default ReportModal;
