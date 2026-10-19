/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as s from "../styles";
import MypageTabBar from "../../../components/common/MypageTabBar/MypageTabBar";
import ConfirmModal from "../../../components/common/ConfirmModal/ConfirmModal";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import Pager from "../Pager";
import { useAdminUsers, useSuspendUser, useUnsuspendUser } from "../../../hooks/admin/useAdmin";
import { SUSPEND_REASON_MAX, type AdminUserListItem } from "../../../Types/adminTypes";
import type { ArtistStatus } from "../../../Types/auth";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { formatDateTime } from "../../../utils/reservationFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";

type Tab = "all" | "suspended";

const ARTIST_LABEL: Partial<Record<ArtistStatus, string>> = {
  PENDING: "아티스트 심사 중",
  APPROVED: "아티스트",
  REJECTED: "아티스트 반려",
};

// 마이페이지 > 관리자 > 회원 관리 (?tab=all|suspended&q=검색어&page=0)
//  - 정지하면 그 계정은 바로 로그아웃되고 로그인할 수 없음. 관리자 계정·본인은 정지 불가
function AdminUsersPage() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get("tab") === "suspended" ? "suspended" : "all";
  const q = params.get("q") ?? "";
  const page = Math.max(0, Number(params.get("page")) || 0);
  const [keyword, setKeyword] = useState(q);

  const usersQ = useAdminUsers(q, tab === "suspended", page);

  // 탭/검색어가 바뀌면 첫 페이지부터
  const update = (next: { tab?: Tab; q?: string; page?: number }) => {
    const merged = { tab, q, page: 0, ...next };
    const sp: Record<string, string> = { tab: merged.tab };
    if (merged.q) sp.q = merged.q;
    if (merged.page) sp.page = String(merged.page);
    setParams(sp);
  };

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>회원 관리</h1>
        <p css={s.desc}>회원을 찾아 계정을 정지하거나 정지를 해제해요. 정지된 계정은 바로 로그아웃되고 다시 로그인할 수 없어요.</p>
      </div>

      <form
        css={s.searchRow}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: keyword.trim() });
        }}
      >
        <label htmlFor="admin-user-search" css={s.srOnly}>
          이메일 또는 이름 검색
        </label>
        <input
          id="admin-user-search"
          css={s.input}
          type="search"
          placeholder="이메일 또는 이름으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" css={s.btn(true)}>
          검색
        </button>
      </form>

      <MypageTabBar
        value={tab}
        items={[
          { key: "all", label: "전체" },
          { key: "suspended", label: "정지된 계정" },
        ]}
        onChange={(next) => update({ tab: next })}
      />

      {usersQ.isLoading ? (
        <div css={s.stateBox}>불러오는 중...</div>
      ) : usersQ.isError ? (
        <div css={s.stateBox}>
          회원 목록을 불러오지 못했어요.
          <button type="button" css={s.textBtn} onClick={() => usersQ.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : !usersQ.data?.content.length ? (
        <div css={s.stateBox}>
          {q ? `"${q}"에 해당하는 회원이 없어요.` : tab === "suspended" ? "정지된 계정이 없어요." : "회원이 없어요."}
        </div>
      ) : (
        <>
          <p css={s.meta}>{usersQ.data.totalElements.toLocaleString("ko-KR")}명</p>
          <ul css={s.list}>
            {usersQ.data.content.map((u) => (
              <UserItem key={u.userId} user={u} />
            ))}
          </ul>
          <Pager
            page={usersQ.data.number}
            totalPages={usersQ.data.totalPages}
            onChange={(next) => update({ page: next })}
          />
        </>
      )}
    </div>
  );
}

function UserItem({ user: u }: { user: AdminUserListItem }) {
  const myId = usePrincipalState((st) => st.principal?.userId);
  const suspendM = useSuspendUser();
  const unsuspendM = useUnsuspendUser();
  const [suspending, setSuspending] = useState(false);
  const [confirmUnsuspend, setConfirmUnsuspend] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const suspended = !!u.suspendedDt;
  const isMe = u.userId === myId;
  const busy = suspendM.isPending || unsuspendM.isPending;
  const artistLabel = ARTIST_LABEL[u.artistStatus];

  const suspend = async () => {
    if (!reason.trim()) {
      setError("정지 사유를 입력해주세요.");
      return;
    }
    try {
      await suspendM.mutateAsync({ userId: u.userId, reason: reason.trim() });
      toast.success(`${u.username}님의 계정을 정지했어요.`);
      setSuspending(false);
      setReason("");
    } catch (e) {
      setError(getErrorMessage(e, "정지하지 못했어요."));
    }
  };

  const unsuspend = async () => {
    try {
      await unsuspendM.mutateAsync(u.userId);
      toast.success(`${u.username}님의 정지를 해제했어요.`);
    } catch (e) {
      toast.error(getErrorMessage(e, "정지를 해제하지 못했어요."));
    } finally {
      setConfirmUnsuspend(false);
    }
  };

  return (
    <li css={s.item}>
      <div css={s.itemHead}>
        <ProfileAvatar src={u.profileImgUrl} name={u.username} size={36} />
        <div css={s.who}>
          <strong>
            {u.username}
            {isMe && " (나)"}
          </strong>
          <span>{u.email}</span>
        </div>
        {suspended && <span css={s.pill("danger")}>정지됨</span>}
      </div>

      <div css={s.pills}>
        {u.admin && <span css={s.pill("dark")}>관리자</span>}
        {artistLabel && <span css={s.pill(u.artistStatus === "APPROVED" ? "strong" : "plain")}>{artistLabel}</span>}
        {!u.emailVerified && <span css={s.pill("plain")}>이메일 미인증</span>}
        {u.sample && <span css={s.pill("plain")}>샘플</span>}
      </div>

      <p css={s.meta}>
        가입 {formatDateTime(u.createDt)}
        {suspended && ` · 정지 ${formatDateTime(u.suspendedDt)}`}
      </p>

      {suspended && u.suspendedReason && (
        <div css={s.rejectBox}>
          <strong>정지 사유</strong>
          <p>{u.suspendedReason}</p>
        </div>
      )}

      {suspending ? (
        <div css={s.form}>
          <label htmlFor={`suspend-${u.userId}`} css={s.srOnly}>
            정지 사유
          </label>
          <textarea
            id={`suspend-${u.userId}`}
            css={s.textarea}
            rows={3}
            maxLength={SUSPEND_REASON_MAX}
            autoFocus
            placeholder="정지 사유 (관리자만 볼 수 있어요)"
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
            <button type="button" css={s.btn(false)} onClick={() => setSuspending(false)} disabled={busy}>
              취소
            </button>
            <button type="button" css={s.btn(true)} onClick={suspend} disabled={busy}>
              {suspendM.isPending ? "정지하는 중..." : "정지하기"}
            </button>
          </div>
        </div>
      ) : suspended ? (
        <div css={s.actions}>
          <button type="button" css={s.btn(false)} onClick={() => setConfirmUnsuspend(true)} disabled={busy}>
            정지 해제
          </button>
        </div>
      ) : (
        !u.admin &&
        !isMe && (
          <div css={s.actions}>
            <button type="button" css={s.btn(false)} onClick={() => setSuspending(true)} disabled={busy}>
              계정 정지
            </button>
          </div>
        )
      )}

      <ConfirmModal
        open={confirmUnsuspend}
        title="정지 해제"
        message={`${u.username}님의 계정 정지를 해제할까요? 해제하면 다시 로그인할 수 있어요.`}
        confirmText="해제"
        cancelText="취소"
        loading={unsuspendM.isPending}
        onConfirm={unsuspend}
        onClose={() => setConfirmUnsuspend(false)}
      />
    </li>
  );
}

export default AdminUsersPage;
