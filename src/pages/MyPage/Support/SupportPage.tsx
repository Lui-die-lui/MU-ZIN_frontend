/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import { useCreateSupport, useMySupport } from "../../../hooks/support/useSupport";
import {
  SUPPORT_CATEGORY_LABEL,
  SUPPORT_MAX,
  type SupportCategory,
  type SupportInquiry,
} from "../../../Types/supportTypes";
import { formatDateTime } from "../../../utils/reservationFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";

const CATEGORIES = Object.keys(SUPPORT_CATEGORY_LABEL) as SupportCategory[];

// 마이페이지 > 운영자 문의
//  - 계정·예약·신고·오류 등 운영자에게 묻기 (아티스트에게 묻는 건 레슨 문의)
//  - 답변이 달리면 알림, 더 물을 게 있으면 새 문의로
function SupportPage() {
  const listQ = useMySupport();

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>운영자 문의</h1>
        <p css={s.desc}>
          계정, 예약, 신고, 오류처럼 운영자의 도움이 필요한 일을 남겨 주세요. 답변이 달리면 알림으로 알려 드려요. 레슨에 대한
          질문은 아티스트에게 레슨 문의로 보내 주세요.
        </p>
      </div>

      <SupportForm />

      <h2 css={s.sectionTitle}>내 문의</h2>
      {listQ.isLoading ? (
        <div css={s.stateBox}>불러오는 중...</div>
      ) : listQ.isError ? (
        <div css={s.stateBox}>
          문의를 불러오지 못했어요.
          <button type="button" css={s.textBtn} onClick={() => listQ.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : !listQ.data?.length ? (
        <div css={s.stateBox}>아직 보낸 문의가 없어요.</div>
      ) : (
        <ul css={s.list}>
          {listQ.data.map((i) => (
            <SupportItem key={i.supportId} inquiry={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SupportForm() {
  const createM = useCreateSupport();
  const [category, setCategory] = useState<SupportCategory | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!category) {
      setError("문의 유형을 골라주세요.");
      return;
    }
    if (!text.trim()) {
      setError("문의 내용을 입력해주세요.");
      return;
    }
    try {
      await createM.mutateAsync({ category, content: text.trim() });
      toast.success("문의를 보냈어요. 답변이 오면 알려드릴게요.");
      setCategory(null);
      setText("");
    } catch (e) {
      setError(getErrorMessage(e, "문의를 보내지 못했어요."));
    }
  };

  return (
    <div css={s.form}>
      <fieldset css={s.fieldset}>
        <legend>문의 유형</legend>
        <div css={s.chips}>
          {CATEGORIES.map((c) => (
            <label key={c} css={s.chip(category === c)}>
              <input
                type="radio"
                name="support-category"
                value={c}
                checked={category === c}
                onChange={() => {
                  setCategory(c);
                  setError(null);
                }}
              />
              {SUPPORT_CATEGORY_LABEL[c]}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor="support-content" css={s.srOnly}>
        문의 내용
      </label>
      <textarea
        id="support-content"
        css={s.textarea}
        rows={6}
        maxLength={SUPPORT_MAX}
        placeholder="어떤 일이 있었는지 알려 주세요. 오류라면 어느 화면에서 무엇을 눌렀는지 적어 주시면 빨리 확인할 수 있어요."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
      />
      {error && (
        <p role="alert" css={s.error}>
          {error}
        </p>
      )}

      <div css={s.formFoot}>
        <span css={s.counter}>
          {text.length}/{SUPPORT_MAX}
        </span>
        <button type="button" css={s.btn(true)} onClick={submit} disabled={createM.isPending}>
          {createM.isPending ? "보내는 중..." : "문의 보내기"}
        </button>
      </div>
    </div>
  );
}

function SupportItem({ inquiry: i }: { inquiry: SupportInquiry }) {
  const answered = i.status === "ANSWERED";
  return (
    <li css={s.item}>
      <div css={s.itemHead}>
        <div css={s.meta}>
          <strong>{SUPPORT_CATEGORY_LABEL[i.category]}</strong>
          <span>{formatDateTime(i.createDt)}</span>
        </div>
        <span css={s.status(answered)}>{answered ? "답변 완료" : "답변 대기"}</span>
      </div>

      <p css={s.content}>{i.content}</p>

      {answered && i.replyContent && (
        <div css={s.reply}>
          <span css={s.replyLabel}>운영자 답변 · {formatDateTime(i.repliedDt)}</span>
          <p>{i.replyContent}</p>
        </div>
      )}
    </li>
  );
}

export default SupportPage;
