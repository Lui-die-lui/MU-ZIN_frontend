/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as s from "../styles";
import * as m from "../Moderation/styles";
import MypageTabBar from "../../../components/common/MypageTabBar/MypageTabBar";
import Pager from "../Pager";
import { useAdminSupport, useAdminSupportOpenCount, useReplySupport } from "../../../hooks/support/useSupport";
import { SUPPORT_CATEGORY_LABEL, SUPPORT_MAX, type AdminSupportItem } from "../../../Types/supportTypes";
import { formatDateTime } from "../../../utils/reservationFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";

type Tab = "open" | "answered";

// 관리자 > 운영자 문의 (?tab=open|answered&page=0)
//  - 답변 대기: 오래된 것부터. 답변은 한 번, 보내면 문의한 사람에게 알림
//  - 답변 완료: 최근 답변부터
function AdminSupportPage() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("tab") === "answered" ? "answered" : "open";
  const page = Math.max(0, Number(params.get("page")) || 0);
  const openCount = useAdminSupportOpenCount(true).data ?? 0;
  const q = useAdminSupport(tab === "open", page);

  const update = (next: { tab?: Tab; page?: number }) => {
    const merged = { tab, page: 0, ...next };
    const sp: Record<string, string> = {};
    if (merged.tab === "answered") sp.tab = "answered";
    if (merged.page) sp.page = String(merged.page);
    setParams(sp);
  };

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>운영자 문의</h1>
        <p css={s.desc}>
          사용자가 마이페이지에서 보낸 문의예요. 답변은 한 번 보낼 수 있고, 보내면 문의한 분에게 알림이 가요.
        </p>
      </div>

      <MypageTabBar
        value={tab}
        items={[
          { key: "open", label: openCount ? `답변 대기 ${openCount}` : "답변 대기" },
          { key: "answered", label: "답변 완료" },
        ]}
        onChange={(next) => update({ tab: next })}
      />

      {q.isLoading ? (
        <div css={s.stateBox}>불러오는 중...</div>
      ) : q.isError ? (
        <div css={s.stateBox}>
          목록을 불러오지 못했어요.
          <button type="button" css={s.textBtn} onClick={() => q.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : !q.data?.content.length ? (
        <div css={s.stateBox}>{tab === "open" ? "답변을 기다리는 문의가 없어요." : "답변한 문의가 없어요."}</div>
      ) : (
        <>
          <ul css={s.list}>
            {q.data.content.map((i) => (
              <SupportRow key={i.supportId} item={i} />
            ))}
          </ul>
          <Pager page={q.data.number} totalPages={q.data.totalPages} onChange={(p) => update({ page: p })} />
        </>
      )}
    </div>
  );
}

function SupportRow({ item: i }: { item: AdminSupportItem }) {
  const replyM = useReplySupport();
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reply = async () => {
    if (!text.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }
    try {
      await replyM.mutateAsync({ supportId: i.supportId, content: text.trim() });
      toast.success("답변했어요. 문의한 분에게 알림이 가요.");
      setReplying(false);
    } catch (e) {
      setError(getErrorMessage(e, "답변하지 못했어요."));
    }
  };

  return (
    <li css={s.item}>
      <div css={s.itemHead}>
        <div css={s.who}>
          <strong>{i.userName}</strong>
          <span>
            {i.userEmail ?? "탈퇴한 회원"} · {formatDateTime(i.createDt)}
          </span>
        </div>
        {i.userSuspended && <span css={s.pill("danger")}>정지됨</span>}
        <span css={s.pill(i.status === "OPEN" ? "strong" : "plain")}>{SUPPORT_CATEGORY_LABEL[i.category]}</span>
      </div>

      <p css={m.detail}>{i.content}</p>

      {i.status === "ANSWERED" ? (
        <>
          {i.replyContent && (
            <div css={m.snapshot}>
              <strong>답변</strong>
              <pre>{i.replyContent}</pre>
            </div>
          )}
          <p css={s.meta}>
            {i.repliedByName ?? "관리자"} · {formatDateTime(i.repliedDt)}
          </p>
        </>
      ) : replying ? (
        <div css={s.form}>
          <label htmlFor={`support-reply-${i.supportId}`} css={s.srOnly}>
            답변
          </label>
          <textarea
            id={`support-reply-${i.supportId}`}
            css={s.textarea}
            rows={5}
            maxLength={SUPPORT_MAX}
            autoFocus
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
          />
          <p css={s.muted}>답변은 한 번만 보낼 수 있고, 보낸 뒤에는 고칠 수 없어요.</p>
          {error && (
            <p role="alert" css={s.error}>
              {error}
            </p>
          )}
          <div css={s.actions}>
            <button type="button" css={s.btn(false)} onClick={() => setReplying(false)} disabled={replyM.isPending}>
              취소
            </button>
            <button type="button" css={s.btn(true)} onClick={reply} disabled={replyM.isPending}>
              {replyM.isPending ? "보내는 중..." : "답변 보내기"}
            </button>
          </div>
        </div>
      ) : (
        <div css={s.actions}>
          <Link to={`/admin/users?q=${encodeURIComponent(i.userEmail ?? i.userName)}`} css={m.linkBtn}>
            회원 정보
          </Link>
          <button type="button" css={s.btn(true)} onClick={() => setReplying(true)}>
            답변하기
          </button>
        </div>
      )}
    </li>
  );
}

export default AdminSupportPage;
