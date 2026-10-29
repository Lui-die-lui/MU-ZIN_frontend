/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { css } from "@emotion/react";
import CommonModal from "../common/CommonModal/CommonModal";
import { useCreateInquiry } from "../../hooks/chat/useChat";
import { INQUIRY_MAX } from "../../Types/chatTypes";
import { getErrorMessage } from "../../utils/errorUtils";
import { toast } from "../../stores/useToastStore";
import { modalBtn } from "../common/CommonModal/modalButtons";

type Props = {
  open: boolean;
  onClose: () => void;
  artistProfileId: number;
  artistName: string;
};

// 레슨 문의 보내기 (레슨·예약 가능한 시간이 없어도 가능)
// 열 때마다 key 로 새로 만들어 이전 입력이 남지 않음 (부모에서 key 지정)
function InquiryModal({ open, onClose, artistProfileId, artistName }: Props) {
  const createM = useCreateInquiry();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!text.trim()) {
      setError("문의 내용을 입력해주세요.");
      return;
    }
    setError(null);
    try {
      await createM.mutateAsync({ artistProfileId, content: text.trim() });
      toast.success("문의를 보냈어요. 답변이 오면 알려드릴게요.");
      onClose();
    } catch (e) {
      setError(getErrorMessage(e, "문의를 보내지 못했어요."));
    }
  };

  return (
    <CommonModal
      open={open}
      title={`${artistName}님에게 문의하기`}
      onClose={createM.isPending ? () => {} : onClose}
      width={520}
      footer={
        <div css={s.footer}>
          <button type="button" css={modalBtn("secondary")} onClick={onClose} disabled={createM.isPending}>
            취소
          </button>
          <button type="button" css={modalBtn("primary")} onClick={submit} disabled={createM.isPending}>
            {createM.isPending ? "보내는 중..." : "문의 보내기"}
          </button>
        </div>
      }
    >
      <div css={s.body}>
        <p css={s.guide}>
          원하는 레슨이 목록에 없어도 괜찮아요. 배우고 싶은 내용, 실력, 원하는 요일·시간을 적어주세요. 아티스트가 답변하거나 채팅으로 이어갈 수 있어요.
        </p>
        <label htmlFor="inquiry-content" css={s.label}>
          문의 내용
        </label>
        <textarea
          id="inquiry-content"
          css={s.textarea}
          rows={6}
          maxLength={INQUIRY_MAX}
          placeholder="예) 기타를 처음 배워요. 평일 저녁에 주 1회 레슨이 가능할까요?"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
        />
        <div css={s.counter}>
          {text.length}/{INQUIRY_MAX}
        </div>
        {error && (
          <p role="alert" css={s.error}>
            {error}
          </p>
        )}
        <p css={s.note}>답변을 기다리는 문의가 있으면 같은 아티스트에게 새 문의를 보낼 수 없어요.</p>
      </div>
    </CommonModal>
  );
}

const s = {
  body: css`
    display: grid;
    gap: 10px;
    text-align: left;
  `,
  guide: css`
    margin: 0;
    padding: 12px 14px;
    border-radius: 10px;
    background: #f7f8f9;
    font-size: 13px;
    line-height: 1.6;
    color: #4b5563;
    word-break: keep-all;
  `,
  label: css`
    font-size: 14px;
    font-weight: 600;
    color: #1b1d20;
  `,
  textarea: css`
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    border: 1px solid #cfd4da;
    border-radius: 10px;
    font: inherit;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    &:focus {
      outline: 3px solid rgba(17, 24, 39, 0.1);
      border-color: #111827;
    }
  `,
  counter: css`
    justify-self: end;
    font-size: 12px;
    color: #6b7280;
  `,
  error: css`
    margin: 0;
    font-size: 13px;
    color: #b42318;
  `,
  note: css`
    margin: 0;
    font-size: 12px;
    color: #6b7280;
  `,
  footer: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
  `,
  btn: (primary: boolean) => css`
    height: 44px;
    padding: 0 18px;
    border: 1px solid ${primary ? "#111827" : "#cfd4da"};
    border-radius: 10px;
    background: ${primary ? "#111827" : "#fff"};
    color: ${primary ? "#fff" : "#1b1d20"};
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
};

export default InquiryModal;
