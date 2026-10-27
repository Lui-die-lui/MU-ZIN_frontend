/** @jsxImportSource @emotion/react */
import { useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as s from "../styles";
import * as m from "./styles";
import MypageTabBar from "../../../components/common/MypageTabBar/MypageTabBar";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import Pager from "../Pager";
import {
  useAbuseFlags,
  useAdminReports,
  useDismissAbuseFlag,
  useModerationCounts,
  useResolveAdminReport,
  useSuspendUser,
} from "../../../hooks/admin/useAdmin";
import {
  ADMIN_MEMO_MAX,
  REPORT_REASON_LABEL,
  SUSPEND_REASON_MAX,
  type AbuseFlagItem,
  type AbuseRule,
  type AdminReportItem,
  type ModerationStatus,
  type ReportTargetType,
} from "../../../Types/adminTypes";
import { formatDateTime } from "../../../utils/reservationFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";

type Tab = "flags" | "reports";

const RULE_LABEL: Record<AbuseRule, string> = {
  CHAT_FLOOD: "채팅 도배",
  INQUIRY_SPAM: "문의 도배",
  RESERVATION_SPAM: "예약 남발",
  RESERVATION_CANCEL: "반복 취소",
  LOGIN_FAILURE: "로그인 실패 반복",
  REVIEW_BURST: "리뷰 몰아쓰기",
  REVIEW_LOW_RATING: "별점 1점 반복",
  REPORTED: "여러 명에게 신고됨",
};

const TARGET_LABEL: Record<ReportTargetType, string> = {
  ARTIST: "아티스트 프로필",
  CHAT_ROOM: "채팅",
  REVIEW: "리뷰",
  INQUIRY: "문의",
};

const STATUS_LABEL: Record<ModerationStatus, string> = {
  OPEN: "확인 전",
  DISMISSED: "문제없음",
  ACTIONED: "조치함",
};

// 관리자 > 이상행동 (?tab=flags|reports&closed=1&page=0)
//  - 감지: 10분마다 기준을 넘은 유저를 자동으로 띄움 (자동 차단은 하지 않음)
//  - 신고: 유저가 아티스트·채팅·리뷰·문의를 신고한 건
//  - 계정을 정지하면 그 유저의 열린 감지·신고가 모두 "조치함"으로 닫혀요
function AdminModerationPage() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("tab") === "reports" ? "reports" : "flags";
  const closed = params.get("closed") === "1";
  const page = Math.max(0, Number(params.get("page")) || 0);
  const counts = useModerationCounts(true).data;

  const update = (next: { tab?: Tab; closed?: boolean; page?: number }) => {
    const merged = { tab, closed, page: 0, ...next };
    const sp: Record<string, string> = {};
    if (merged.tab === "reports") sp.tab = "reports";
    if (merged.closed) sp.closed = "1";
    if (merged.page) sp.page = String(merged.page);
    setParams(sp);
  };

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>이상행동 · 신고</h1>
        <p css={s.desc}>
          기준을 넘은 행동은 10분마다 자동으로 모이고, 유저가 보낸 신고도 여기서 확인해요. 자동으로 막지는 않아요. 근거를 보고
          정지하거나 문제없음으로 닫아주세요.
        </p>
      </div>

      <MypageTabBar
        value={tab}
        items={[
          { key: "flags", label: counts?.openFlags ? `이상행동 감지 ${counts.openFlags}` : "이상행동 감지" },
          { key: "reports", label: counts?.openReports ? `신고 ${counts.openReports}` : "신고" },
        ]}
        onChange={(next) => update({ tab: next })}
      />

      <label css={m.closedToggle}>
        <input type="checkbox" checked={closed} onChange={(e) => update({ closed: e.target.checked })} />
        처리된 건 보기
      </label>

      {tab === "flags" ? (
        <FlagList open={!closed} page={page} onPage={(p) => update({ page: p })} />
      ) : (
        <ReportList open={!closed} page={page} onPage={(p) => update({ page: p })} />
      )}
    </div>
  );
}

// ---------- 공용: 상태 줄 · 정지 폼 ----------

function Resolved({ status, by, at, memo }: { status: ModerationStatus; by: string | null; at: string | null; memo?: string | null }) {
  if (status === "OPEN") return null;
  return (
    <p css={s.meta}>
      <span css={s.pill(status === "ACTIONED" ? "dark" : "plain")}>{STATUS_LABEL[status]}</span> {by ?? "관리자"} ·{" "}
      {formatDateTime(at)}
      {memo && ` · ${memo}`}
    </p>
  );
}

function SuspendForm({
  userId,
  username,
  defaultReason,
  onDone,
  onCancel,
}: {
  userId: number;
  username: string;
  defaultReason: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const suspendM = useSuspendUser();
  const [reason, setReason] = useState(defaultReason.slice(0, SUSPEND_REASON_MAX));
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!reason.trim()) {
      setError("정지 사유를 입력해주세요.");
      return;
    }
    try {
      await suspendM.mutateAsync({ userId, reason: reason.trim() });
      toast.success(`${username}님의 계정을 정지했어요.`);
      onDone();
    } catch (e) {
      setError(getErrorMessage(e, "정지하지 못했어요."));
    }
  };

  return (
    <div css={s.form}>
      <label htmlFor={`mod-suspend-${userId}`} css={s.srOnly}>
        정지 사유
      </label>
      <textarea
        id={`mod-suspend-${userId}`}
        css={s.textarea}
        rows={3}
        maxLength={SUSPEND_REASON_MAX}
        autoFocus
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          setError(null);
        }}
      />
      <p css={s.muted}>정지하면 바로 로그아웃되고 다시 로그인할 수 없어요. 이 유저의 다른 감지·신고도 함께 닫혀요.</p>
      {error && (
        <p role="alert" css={s.error}>
          {error}
        </p>
      )}
      <div css={s.actions}>
        <button type="button" css={s.btn(false)} onClick={onCancel} disabled={suspendM.isPending}>
          취소
        </button>
        <button type="button" css={s.btn(true)} onClick={submit} disabled={suspendM.isPending}>
          {suspendM.isPending ? "정지하는 중..." : "정지하기"}
        </button>
      </div>
    </div>
  );
}

function UserHead({ name, email, img, suspended, children }: { name: string; email: string; img: string | null; suspended: boolean; children?: ReactNode }) {
  return (
    <div css={s.itemHead}>
      <ProfileAvatar src={img} name={name} size={36} />
      <div css={s.who}>
        <strong>{name}</strong>
        <span>{email}</span>
      </div>
      {suspended && <span css={s.pill("danger")}>정지됨</span>}
      {children}
    </div>
  );
}

function ListState({
  isLoading,
  isError,
  empty,
  emptyText,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  empty: boolean;
  emptyText: string;
  onRetry: () => void;
}) {
  if (isLoading) return <div css={s.stateBox}>불러오는 중...</div>;
  if (isError)
    return (
      <div css={s.stateBox}>
        목록을 불러오지 못했어요.
        <button type="button" css={s.textBtn} onClick={onRetry}>
          다시 불러오기
        </button>
      </div>
    );
  if (empty) return <div css={s.stateBox}>{emptyText}</div>;
  return null;
}

// ---------- 이상행동 감지 ----------

function FlagList({ open, page, onPage }: { open: boolean; page: number; onPage: (p: number) => void }) {
  const q = useAbuseFlags(open, page);
  const state = (
    <ListState
      isLoading={q.isLoading}
      isError={q.isError}
      empty={!q.data?.content.length}
      emptyText={open ? "지금 확인할 이상행동이 없어요." : "처리된 건이 없어요."}
      onRetry={() => q.refetch()}
    />
  );
  if (q.isLoading || q.isError || !q.data?.content.length) return state;

  return (
    <>
      <p css={s.meta}>{q.data.totalElements.toLocaleString("ko-KR")}건</p>
      <ul css={s.list}>
        {q.data.content.map((f) => (
          <FlagItem key={f.abuseFlagId} flag={f} />
        ))}
      </ul>
      <Pager page={q.data.number} totalPages={q.data.totalPages} onChange={onPage} />
    </>
  );
}

function FlagItem({ flag: f }: { flag: AbuseFlagItem }) {
  const dismissM = useDismissAbuseFlag();
  const [suspending, setSuspending] = useState(false);
  // 로그인 실패는 이 계정이 공격받는 쪽이라 정지 대상이 아님
  const victim = f.rule === "LOGIN_FAILURE";

  const dismiss = async () => {
    try {
      await dismissM.mutateAsync(f.abuseFlagId);
      toast.success("문제없음으로 닫았어요. 7일 동안은 같은 이유로 다시 뜨지 않아요.");
    } catch (e) {
      toast.error(getErrorMessage(e, "처리하지 못했어요."));
    }
  };

  return (
    <li css={s.item}>
      <UserHead name={f.username} email={f.email} img={f.profileImgUrl} suspended={f.suspended}>
        <span css={s.pill(victim ? "plain" : "strong")}>{RULE_LABEL[f.rule]}</span>
      </UserHead>

      <p css={m.detail}>{f.detail}</p>
      <p css={s.meta}>
        처음 감지 {formatDateTime(f.detectedDt)}
        {f.lastDetectedDt !== f.detectedDt && ` · 마지막 감지 ${formatDateTime(f.lastDetectedDt)}`}
      </p>
      {victim && f.status === "OPEN" && (
        <p css={s.muted}>
          누군가 이 계정의 비밀번호를 맞히려는 것일 수 있어요. 계정 주인 잘못이 아니라서 정지 대신, 확인 후 닫거나 계정 주인에게 비밀번호
          변경을 안내해주세요. (5번 틀리면 1시간 동안 로그인이 자동으로 잠겨요)
        </p>
      )}
      <Resolved status={f.status} by={f.resolvedByName} at={f.resolvedDt} />

      {f.status === "OPEN" &&
        (suspending ? (
          <SuspendForm
            userId={f.userId}
            username={f.username}
            defaultReason={`${RULE_LABEL[f.rule]}: ${f.detail}`}
            onDone={() => setSuspending(false)}
            onCancel={() => setSuspending(false)}
          />
        ) : (
          <div css={s.actions}>
            <Link css={m.linkBtn} to={`/admin/users?q=${encodeURIComponent(f.email)}`}>
              회원 정보
            </Link>
            <button type="button" css={s.btn(false)} onClick={dismiss} disabled={dismissM.isPending}>
              문제없음
            </button>
            {!victim && !f.suspended && (
              <button type="button" css={s.btn(true)} onClick={() => setSuspending(true)} disabled={dismissM.isPending}>
                계정 정지
              </button>
            )}
          </div>
        ))}
    </li>
  );
}

// ---------- 신고 ----------

function ReportList({ open, page, onPage }: { open: boolean; page: number; onPage: (p: number) => void }) {
  const q = useAdminReports(open, page);
  const state = (
    <ListState
      isLoading={q.isLoading}
      isError={q.isError}
      empty={!q.data?.content.length}
      emptyText={open ? "확인할 신고가 없어요." : "처리된 신고가 없어요."}
      onRetry={() => q.refetch()}
    />
  );
  if (q.isLoading || q.isError || !q.data?.content.length) return state;

  return (
    <>
      <p css={s.meta}>{q.data.totalElements.toLocaleString("ko-KR")}건</p>
      <ul css={s.list}>
        {q.data.content.map((r) => (
          <ReportItem key={r.reportId} report={r} />
        ))}
      </ul>
      <Pager page={q.data.number} totalPages={q.data.totalPages} onChange={onPage} />
    </>
  );
}

function ReportItem({ report: r }: { report: AdminReportItem }) {
  const resolveM = useResolveAdminReport();
  const [mode, setMode] = useState<"idle" | "suspend" | "close">("idle");
  const [memo, setMemo] = useState("");

  const close = async (actioned: boolean) => {
    try {
      await resolveM.mutateAsync({ reportId: r.reportId, actioned, memo: memo.trim() });
      toast.success(actioned ? "조치 완료로 처리했어요." : "문제없음으로 닫았어요.");
      setMode("idle");
    } catch (e) {
      toast.error(getErrorMessage(e, "처리하지 못했어요."));
    }
  };

  return (
    <li css={s.item}>
      <UserHead name={r.targetName} email={r.targetEmail} img={r.targetProfileImgUrl} suspended={r.targetSuspended}>
        <span css={s.pill("strong")}>{REPORT_REASON_LABEL[r.reason]}</span>
      </UserHead>

      <div css={s.pills}>
        <span css={s.pill("plain")}>{TARGET_LABEL[r.targetType]}</span>
        {r.status === "OPEN" && r.targetOpenReports > 1 && (
          <span css={s.pill("danger")}>이 유저 신고 {r.targetOpenReports}건</span>
        )}
      </div>

      {r.detail && <p css={m.detail}>“{r.detail}”</p>}

      {r.contentSnapshot && (
        <div css={m.snapshot}>
          <strong>신고 당시 내용</strong>
          <pre>{r.contentSnapshot}</pre>
        </div>
      )}

      <p css={s.meta}>
        신고한 사람 {r.reporterName} ({r.reporterEmail}) · {formatDateTime(r.createDt)}
      </p>
      <Resolved status={r.status} by={r.resolvedByName} at={r.resolvedDt} memo={r.adminMemo} />

      {r.status === "OPEN" &&
        (mode === "suspend" ? (
          <SuspendForm
            userId={r.targetUserId}
            username={r.targetName}
            defaultReason={`신고(${REPORT_REASON_LABEL[r.reason]})${r.detail ? `: ${r.detail}` : ""}`}
            onDone={() => setMode("idle")}
            onCancel={() => setMode("idle")}
          />
        ) : mode === "close" ? (
          <div css={s.form}>
            <label htmlFor={`report-memo-${r.reportId}`} css={s.srOnly}>
              처리 메모
            </label>
            <textarea
              id={`report-memo-${r.reportId}`}
              css={s.textarea}
              rows={2}
              maxLength={ADMIN_MEMO_MAX}
              autoFocus
              placeholder="처리 메모 (선택, 관리자만 볼 수 있어요) 예: 경고 메일 보냄"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
            <div css={s.actions}>
              <button type="button" css={s.btn(false)} onClick={() => setMode("idle")} disabled={resolveM.isPending}>
                취소
              </button>
              <button type="button" css={s.btn(false)} onClick={() => close(false)} disabled={resolveM.isPending}>
                문제없음
              </button>
              <button type="button" css={s.btn(true)} onClick={() => close(true)} disabled={resolveM.isPending}>
                조치 완료
              </button>
            </div>
          </div>
        ) : (
          <div css={s.actions}>
            <Link css={m.linkBtn} to={`/admin/users?q=${encodeURIComponent(r.targetEmail)}`}>
              회원 정보
            </Link>
            <button type="button" css={s.btn(false)} onClick={() => setMode("close")}>
              정지 없이 닫기
            </button>
            {!r.targetSuspended && (
              <button type="button" css={s.btn(true)} onClick={() => setMode("suspend")}>
                계정 정지
              </button>
            )}
          </div>
        ))}
    </li>
  );
}

export default AdminModerationPage;
