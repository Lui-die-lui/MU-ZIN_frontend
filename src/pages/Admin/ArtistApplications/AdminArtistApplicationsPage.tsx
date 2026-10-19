/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as s from "../styles";
import MypageTabBar from "../../../components/common/MypageTabBar/MypageTabBar";
import ConfirmModal from "../../../components/common/ConfirmModal/ConfirmModal";
import Pager from "../Pager";
import {
  useApproveArtist,
  useArtistApplication,
  useArtistApplications,
  usePendingApplicationCount,
  useRejectArtist,
} from "../../../hooks/admin/useAdmin";
import {
  REJECT_REASON_MAX,
  REJECT_TITLE_MAX,
  type AdminArtistApplyListItem,
  type ReviewStatus,
} from "../../../Types/adminTypes";
import { formatDateTime } from "../../../utils/reservationFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";

const TABS: { key: ReviewStatus; label: string }[] = [
  { key: "PENDING", label: "심사 대기" },
  { key: "APPROVED", label: "승인됨" },
  { key: "REJECTED", label: "반려됨" },
];

const STATUS_LABEL: Record<ReviewStatus, string> = {
  PENDING: "심사 대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

// 마이페이지 > 관리자 > 아티스트 신청 심사 (?tab=PENDING|APPROVED|REJECTED&page=0)
//  - 대기 중인 신청만 승인/반려 가능 (백엔드 규칙). 결과는 신청자에게 알림으로 감
function AdminArtistApplicationsPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("tab") as ReviewStatus | null;
  const tab: ReviewStatus = TABS.some((t) => t.key === raw) ? raw! : "PENDING";
  const page = Math.max(0, Number(params.get("page")) || 0);

  const q = useArtistApplications(tab, page);
  const pendingCount = usePendingApplicationCount(true).data ?? 0;

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>아티스트 신청 심사</h1>
        <p css={s.desc}>제출된 아티스트 프로필을 확인하고 승인하거나 반려해요. 결과는 신청자에게 알림으로 전달돼요.</p>
      </div>

      <MypageTabBar
        value={tab}
        items={TABS.map((t) => ({
          key: t.key,
          label: t.key === "PENDING" && pendingCount ? `${t.label} ${pendingCount}` : t.label,
        }))}
        onChange={(next) => setParams({ tab: next })}
      />

      {q.isLoading ? (
        <div css={s.stateBox}>불러오는 중...</div>
      ) : q.isError ? (
        <div css={s.stateBox}>
          신청 목록을 불러오지 못했어요.
          <button type="button" css={s.textBtn} onClick={() => q.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : !q.data?.content.length ? (
        <div css={s.stateBox}>{tab === "PENDING" ? "심사를 기다리는 신청이 없어요." : "해당하는 신청이 없어요."}</div>
      ) : (
        <>
          <ul css={s.list}>
            {q.data.content.map((a) => (
              <ApplicationItem key={a.artistProfileId} app={a} />
            ))}
          </ul>
          <Pager
            page={q.data.number}
            totalPages={q.data.totalPages}
            onChange={(next) => setParams({ tab, page: String(next) })}
          />
        </>
      )}
    </div>
  );
}

function ApplicationItem({ app: a }: { app: AdminArtistApplyListItem }) {
  const [open, setOpen] = useState(false);
  const status = a.artistStatus as ReviewStatus;

  return (
    <li css={s.item}>
      <div css={s.itemHead}>
        <div css={s.who}>
          <strong>{a.username}</strong>
          <span>{a.email}</span>
        </div>
        <span css={s.pill(status === "PENDING" ? "strong" : status === "REJECTED" ? "danger" : "plain")}>
          {STATUS_LABEL[status] ?? a.artistStatus}
        </span>
      </div>

      <p css={s.meta}>
        제출 {formatDateTime(a.submittedDt)}
        {a.reviewedDt && ` · 처리 ${formatDateTime(a.reviewedDt)}`}
        {a.rejectReasonTitle && ` · 반려 사유: ${a.rejectReasonTitle}`}
      </p>

      {open ? (
        <ApplicationDetail artistProfileId={a.artistProfileId} onClose={() => setOpen(false)} />
      ) : (
        <div css={s.actions}>
          <button type="button" css={s.btn(status === "PENDING")} onClick={() => setOpen(true)}>
            {status === "PENDING" ? "신청 내용 보고 심사하기" : "신청 내용 보기"}
          </button>
        </div>
      )}
    </li>
  );
}

function ApplicationDetail({ artistProfileId, onClose }: { artistProfileId: number; onClose: () => void }) {
  const q = useArtistApplication(artistProfileId);
  const approveM = useApproveArtist();
  const rejectM = useRejectArtist();
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const busy = approveM.isPending || rejectM.isPending;

  if (q.isLoading) return <div css={s.stateBox}>불러오는 중...</div>;
  if (q.isError || !q.data)
    return (
      <div css={s.stateBox}>
        신청 내용을 불러오지 못했어요.
        <button type="button" css={s.textBtn} onClick={() => q.refetch()}>
          다시 불러오기
        </button>
      </div>
    );

  const d = q.data;
  const isPending = d.artistStatus === "PENDING";

  const approve = async () => {
    try {
      await approveM.mutateAsync(artistProfileId);
      toast.success(`${d.username}님을 아티스트로 승인했어요.`);
      setConfirmApprove(false);
    } catch (e) {
      setConfirmApprove(false);
      toast.error(getErrorMessage(e, "승인하지 못했어요."));
    }
  };

  const reject = async () => {
    if (!title.trim() || !reason.trim()) {
      setError("반려 사유 제목과 내용을 모두 입력해주세요.");
      return;
    }
    try {
      await rejectM.mutateAsync({ artistProfileId, title: title.trim(), reason: reason.trim() });
      toast.success(`${d.username}님의 신청을 반려했어요.`);
    } catch (e) {
      setError(getErrorMessage(e, "반려하지 못했어요."));
    }
  };

  return (
    <>
      <div css={s.detail}>
        <div css={s.field}>
          <span>전공</span>
          <p>{d.majorName || "-"}</p>
        </div>
        <div css={s.field}>
          <span>악기</span>
          {d.instruments.length ? (
            <div css={s.pills}>
              {d.instruments.map((i) => (
                <span key={i.instId} css={s.pill("plain")}>
                  {i.instName}
                </span>
              ))}
            </div>
          ) : (
            <p>-</p>
          )}
        </div>
        <div css={s.field}>
          <span>소개</span>
          <p>{d.bio || "-"}</p>
        </div>
        <div css={s.field}>
          <span>경력</span>
          <p>{d.career || "-"}</p>
        </div>
        {d.artistStatus === "REJECTED" && d.rejectReasonTitle && (
          <div css={s.rejectBox}>
            <strong>{d.rejectReasonTitle}</strong>
            {d.rejectedReason && <p>{d.rejectedReason}</p>}
          </div>
        )}
      </div>

      {isPending && rejecting ? (
        <div css={s.form}>
          <label htmlFor={`reject-title-${artistProfileId}`} css={s.srOnly}>
            반려 사유 제목
          </label>
          <input
            id={`reject-title-${artistProfileId}`}
            css={s.input}
            maxLength={REJECT_TITLE_MAX}
            autoFocus
            placeholder="반려 사유 제목 (예: 경력 확인 자료 부족)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
          />
          <label htmlFor={`reject-reason-${artistProfileId}`} css={s.srOnly}>
            반려 사유 내용
          </label>
          <textarea
            id={`reject-reason-${artistProfileId}`}
            css={s.textarea}
            rows={4}
            maxLength={REJECT_REASON_MAX}
            placeholder="신청자가 무엇을 보완하면 되는지 알려주세요. 신청자 화면에 그대로 보여요."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(null);
            }}
          />
          {error && (
            <p role="alert" css={s.error}>
              {error}
            </p>
          )}
          <div css={s.actions}>
            <button type="button" css={s.btn(false)} onClick={() => setRejecting(false)} disabled={busy}>
              취소
            </button>
            <button type="button" css={s.btn(true)} onClick={reject} disabled={busy}>
              {rejectM.isPending ? "반려하는 중..." : "반려하기"}
            </button>
          </div>
        </div>
      ) : (
        <div css={s.actions}>
          <button type="button" css={s.btn(false)} onClick={onClose} disabled={busy}>
            접기
          </button>
          {isPending && (
            <>
              <button type="button" css={s.btn(false)} onClick={() => setRejecting(true)} disabled={busy}>
                반려
              </button>
              <button type="button" css={s.btn(true)} onClick={() => setConfirmApprove(true)} disabled={busy}>
                승인
              </button>
            </>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmApprove}
        title="아티스트 승인"
        message={`${d.username}님을 아티스트로 승인할까요? 승인하면 바로 레슨을 만들고 공개할 수 있어요.`}
        confirmText="승인"
        cancelText="취소"
        loading={approveM.isPending}
        onConfirm={approve}
        onClose={() => setConfirmApprove(false)}
      />
    </>
  );
}

export default AdminArtistApplicationsPage;
