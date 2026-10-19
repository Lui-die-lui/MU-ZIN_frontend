/** @jsxImportSource @emotion/react */
import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as s from "./styles";
import AssistantCards from "./AssistantCards";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import { usePrincipalState } from "../../stores/usePrincipalState";
import {
  useAssistantConversation,
  useAssistantConversations,
  useAssistantQuota,
  useDeleteAllAssistantConversations,
  useDeleteAssistantConversation,
  useSendAssistantMessage,
  useStartAssistant,
} from "../../hooks/assistant/useAssistant";
import { ASSISTANT_ERRORS, ASSISTANT_MESSAGE_MAX, type AssistantConversation, type AssistantQuota } from "../../Types/assistantTypes";
import { isComplete, toAssistantContext } from "../../features/hobbyFinder/engine";
import { loadSaved } from "../../features/hobbyFinder/storage";
import { ApiError } from "../../utils/errorUtils";
import { formatDateTime } from "../../utils/reservationFormat";

const EXAMPLES = [
  "주말 오후에 배울 수 있는 기타 레슨을 찾아줘",
  "서울에서 처음 시작하는 피아노 레슨 추천해줘",
  "온라인으로 할 수 있는 보컬 레슨이 있을까?",
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 서버의 KST 시각 문자열("2026-10-26T00:00:00")을 브라우저 시간대와 상관없이 그대로 표시
function kstLabel(v: string) {
  const [d, t = "00:00"] = v.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, day)).getUTCDay()];
  return `${m}월 ${day}일 (${wd}) ${t.slice(0, 5)}`;
}

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `k-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

// 마이페이지처럼 로그인 필요. 로그인 안 했으면 안내 (기존 로그인 화면으로)
function AssistantPage() {
  const hydrated = usePrincipalState((st) => st.hydrated);
  const isAuthenticated = usePrincipalState((st) => st.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  if (!hydrated) return <div css={s.page}>불러오는 중...</div>;
  if (!isAuthenticated) {
    return (
      <main css={s.page}>
        <section css={s.gate} aria-labelledby="assistant-gate-title">
          <h1 id="assistant-gate-title">AI 레슨 내비게이터</h1>
          <p>
            원하는 레슨을 말로 설명하면 MU:ZIN에 등록된 공개 레슨과 아티스트 중에서 맞는 선택지를 찾아 드려요.
            <br />
            로그인한 회원만 쓸 수 있어요.
          </p>
          <div css={s.noticeActions}>
            <button type="button" css={s.primaryBtn} onClick={() => navigate("/signin", { state: { from: location } })}>
              로그인하고 시작하기
            </button>
            <Link to="/lessons" css={s.secondaryBtn} style={{ height: 48 }}>
              레슨 직접 찾기
            </Link>
          </div>
        </section>
      </main>
    );
  }
  return <AssistantWorkspace />;
}

function AssistantWorkspace() {
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const [params, setParams] = useSearchParams();
  const selectedId = Number(params.get("c")) || null;

  const quotaQ = useAssistantQuota(true);
  const listQ = useAssistantConversations(true);
  const convQ = useAssistantConversation(selectedId);
  const deleteAllM = useDeleteAllAssistantConversations();
  const [confirmAll, setConfirmAll] = useState(false);

  const select = (id: number | null) => setParams(id ? { c: String(id) } : {});
  const quota = quotaQ.data;

  return (
    <main css={s.page}>
      <div css={s.head}>
        <div css={s.titleBlock}>
          <h1>AI 레슨 내비게이터</h1>
          <p>원하는 레슨을 말로 설명하면 MU:ZIN에 등록된 공개 레슨·아티스트 중에서 찾아 드려요. 가격과 예약 가능 시간은 카드의 최신 정보로 확인하세요.</p>
        </div>
        {quota && <QuotaChips quota={quota} />}
      </div>

      {quota && !quota.available && (
        <div css={s.notice("warn")} role="status">
          <strong>{quota.unavailableCode === ASSISTANT_ERRORS.BUDGET_EXHAUSTED ? "이번 달 AI 이용량이 모두 소진됐어요" : "지금은 AI 내비게이터를 쓸 수 없어요"}</strong>
          조건으로 직접 찾는 레슨 찾기는 그대로 쓸 수 있어요.
          <div css={s.noticeActions}>
            <Link to="/lessons" css={s.secondaryBtn}>
              레슨 찾기로 이동
            </Link>
          </div>
        </div>
      )}

      <div css={s.layout}>
        <aside css={s.side} aria-label="이전 대화">
          <div css={s.sideHead}>
            <span>이전 대화</span>
            <button type="button" css={s.textBtn} onClick={() => select(null)}>
              새 대화
            </button>
          </div>
          {listQ.isLoading ? (
            <p css={s.muted}>불러오는 중...</p>
          ) : !listQ.data?.length ? (
            <p css={s.muted}>아직 대화가 없어요.</p>
          ) : (
            <ul css={s.convList}>
              {listQ.data.map((c) => (
                <li key={c.conversationId}>
                  <button type="button" css={s.convItem(c.conversationId === selectedId)} onClick={() => select(c.conversationId)}
                    aria-current={c.conversationId === selectedId ? "page" : undefined}>
                    <strong>{c.title}</strong>
                    <span>
                      {formatDateTime(c.updateDt)} · 질문 {c.userMessageCount}/{c.maxUserMessages}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!!listQ.data?.length && (
            <button type="button" css={s.textBtn} style={{ justifySelf: "start" }} onClick={() => setConfirmAll(true)}>
              대화 기록 전체 삭제
            </button>
          )}
          <p css={s.muted}>대화 기록은 마지막 대화 후 90일이 지나면 자동으로 지워져요.</p>
        </aside>

        <div css={s.main}>
          {selectedId ? (
            convQ.isLoading ? (
              <div css={s.panel}>불러오는 중...</div>
            ) : convQ.isError || !convQ.data ? (
              <div css={s.notice("error")} role="alert">
                대화를 찾을 수 없어요.
                <div css={s.noticeActions}>
                  <button type="button" css={s.secondaryBtn} onClick={() => select(null)}>
                    새 대화 시작
                  </button>
                </div>
              </div>
            ) : (
              <Thread key={convQ.data.conversationId} conv={convQ.data} quota={quota} onNew={() => select(null)} />
            )
          ) : (
            <Starter userId={userId} quota={quota} onStarted={(id) => select(id)} />
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmAll}
        title="대화 기록 전체 삭제"
        message="모든 AI 대화 기록을 지울까요? 지운 기록은 되돌릴 수 없고, 이번 주 이용 횟수는 돌아오지 않아요."
        confirmText="삭제"
        cancelText="취소"
        loading={deleteAllM.isPending}
        onConfirm={() =>
          deleteAllM.mutate(undefined, {
            onSettled: () => {
              setConfirmAll(false);
              select(null);
            },
          })
        }
        onClose={() => setConfirmAll(false)}
      />
    </main>
  );
}

function QuotaChips({ quota }: { quota: AssistantQuota }) {
  return (
    <div css={s.quota} aria-label="이번 주 이용량">
      <span css={s.quotaChip(true)}>
        이번 주 {quota.used}/{quota.weeklyLimit}회
      </span>
      <span css={s.quotaChip(false)}>남은 {quota.remaining}회</span>
      <span css={s.quotaChip(false)}>{kstLabel(quota.resetsAt)} 초기화 (한국 시간)</span>
    </div>
  );
}

// ---------- 오류 안내 ----------

function ErrorNotice({ error, onRetry, onNew }: { error: unknown; onRetry?: () => void; onNew?: () => void }) {
  const e = error instanceof ApiError ? error : null;
  const code = e?.code;
  const network = e?.httpStatus === 0;
  return (
    <div css={s.notice(code === ASSISTANT_ERRORS.BUDGET_EXHAUSTED || code === ASSISTANT_ERRORS.UNAVAILABLE ? "warn" : "error")} role="alert">
      <strong>
        {network
          ? "연결이 끊겼어요"
          : code === ASSISTANT_ERRORS.WEEKLY_LIMIT
            ? "이번 주 이용 횟수를 모두 썼어요"
            : code === ASSISTANT_ERRORS.MESSAGE_LIMIT
              ? "이 대화의 질문 횟수를 모두 썼어요"
              : code === ASSISTANT_ERRORS.BUDGET_EXHAUSTED
                ? "이번 달 AI 이용량이 모두 소진됐어요"
                : code === ASSISTANT_ERRORS.IN_PROGRESS
                  ? "이전 질문을 처리하는 중이에요"
                  : "답변을 받지 못했어요"}
      </strong>
      {network ? "같은 요청을 다시 보내도 한 번만 처리돼요." : e?.message ?? "잠시 후 다시 시도해 주세요."}
      <div css={s.noticeActions}>
        {(code === ASSISTANT_ERRORS.BUDGET_EXHAUSTED || code === ASSISTANT_ERRORS.UNAVAILABLE || code === ASSISTANT_ERRORS.WEEKLY_LIMIT) && (
          <Link to="/lessons" css={s.secondaryBtn}>
            레슨 찾기로 이동
          </Link>
        )}
        {code === ASSISTANT_ERRORS.MESSAGE_LIMIT && onNew && (
          <button type="button" css={s.secondaryBtn} onClick={onNew}>
            새 대화 시작
          </button>
        )}
        {(network || code === ASSISTANT_ERRORS.AI_ERROR || code === ASSISTANT_ERRORS.IN_PROGRESS) && onRetry && (
          <button type="button" css={s.secondaryBtn} onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}

// 요청 식별 값: 같은 내용을 다시 보낼 때(연결 끊김 재시도)는 같은 값, 서버가 처리를 끝냈거나 내용이 바뀌면 새 값
function useIdempotencyKey() {
  const ref = useRef<{ text: string; key: string } | null>(null);
  return {
    keyFor: (text: string) => {
      if (!ref.current || ref.current.text !== text) ref.current = { text, key: newKey() };
      return ref.current.key;
    },
    settle: (error: unknown) => {
      // 응답을 못 받은 경우(네트워크)만 같은 값을 남겨 재시도가 중복 처리되지 않게
      if (!(error instanceof ApiError && error.httpStatus === 0)) ref.current = null;
    },
  };
}

function Waiting() {
  return (
    <div css={s.thinking} role="status" aria-live="polite">
      <i aria-hidden="true">
        <span />
        <span />
        <span />
      </i>
      MU:ZIN에 등록된 레슨을 찾고 있어요
    </div>
  );
}

// ---------- 새 대화 ----------

function Starter({ userId, quota, onStarted }: { userId: number | null; quota?: AssistantQuota; onStarted: (id: number) => void }) {
  const startM = useStartAssistant();
  const idem = useIdempotencyKey();
  const [text, setText] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  // 취향 진단: 이 계정 결과는 기본 반영(끌 수 있음), 비로그인 때 결과는 사용자가 고를 때만 (자동으로 합치지 않음)
  const own = useMemo(() => loadSaved(userId), [userId]);
  const guest = useMemo(() => loadSaved(null), []);
  const ownReady = isComplete(own.answers);
  const guestReady = !ownReady && isComplete(guest.answers);
  const [useOwn, setUseOwn] = useState(true);
  const [useGuest, setUseGuest] = useState(false);
  const context = useMemo(() => {
    if (ownReady && useOwn) return toAssistantContext(own.answers, own.region);
    if (guestReady && useGuest) return toAssistantContext(guest.answers, guest.region);
    return null;
  }, [ownReady, useOwn, guestReady, useGuest, own, guest]);

  const blocked = !!quota && (!quota.available || quota.remaining <= 0);
  const trimmed = text.trim();

  const submit = (value = trimmed) => {
    if (!value || startM.isPending) return;
    setSent(value);
    startM.mutate(
      { message: value, styleContext: context, idempotencyKey: idem.keyFor(value) },
      {
        onSuccess: (d) => {
          idem.settle(null);
          setText("");
          onStarted(d.conversationId);
        },
        onError: (e) => idem.settle(e),
      },
    );
  };

  return (
    <section css={s.panel} aria-labelledby="assistant-start-title">
      <h2 id="assistant-start-title" css={s.sectionLabel}>
        새 대화 · 시작하면 이번 주 이용 횟수 1회를 써요 (이어지는 질문 5번은 차감 없음)
      </h2>

      <div css={s.context}>
        {ownReady ? (
          <label css={s.check}>
            <input type="checkbox" checked={useOwn} onChange={(e) => setUseOwn(e.target.checked)} />
            <div>
              <strong>내 음악 스타일 찾기 결과 반영</strong>
              <span>체크를 풀면 취향 정보 없이 대화만으로 찾아요.</span>
            </div>
          </label>
        ) : guestReady ? (
          <label css={s.check}>
            <input type="checkbox" checked={useGuest} onChange={(e) => setUseGuest(e.target.checked)} />
            <div>
              <strong>로그인 전에 한 음악 스타일 찾기 결과 가져오기</strong>
              <span>이 기기에서 로그인하지 않고 한 결과예요. 체크한 경우에만 이번 대화에 보내요.</span>
            </div>
          </label>
        ) : (
          <p css={s.muted}>
            음악 스타일 찾기 결과가 없어도 쓸 수 있어요. 취향을 반영하고 싶다면 <Link to="/hobby-finder">내 음악 스타일 찾기</Link>를 먼저 해 보세요.
          </p>
        )}
        {context && (
          <div css={s.chips} aria-label="반영할 취향">
            {context.recommended.map((r) => (
              <span key={r.id} css={s.chip}>
                {r.name}
              </span>
            ))}
            {context.region && (
              <span css={s.chip}>
                {[context.region.region1DepthName, context.region.region2DepthName].filter(Boolean).join(" ")}
              </span>
            )}
          </div>
        )}
      </div>

      {startM.isPending ? (
        <div css={s.messages}>
          <div css={s.userBubble}>{sent}</div>
          <Waiting />
        </div>
      ) : (
        <>
          <div css={s.chips} aria-label="질문 예시">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" css={s.exampleBtn} onClick={() => setText(ex)} disabled={blocked}>
                {ex}
              </button>
            ))}
          </div>
          <form
            css={s.composer}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label htmlFor="assistant-start" css={s.srOnly}>
              찾고 싶은 레슨 설명
            </label>
            <textarea
              id="assistant-start"
              css={s.textarea}
              value={text}
              maxLength={ASSISTANT_MESSAGE_MAX}
              disabled={blocked}
              placeholder="예: 평일 저녁, 서울 강남에서 처음 배우는 드럼 레슨을 찾고 있어요."
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <div css={s.composerRow}>
              <span css={s.counter}>
                {text.length}/{ASSISTANT_MESSAGE_MAX}
              </span>
              <button type="submit" css={s.primaryBtn} disabled={!trimmed || blocked}>
                대화 시작
              </button>
            </div>
            {quota && quota.available && quota.remaining <= 0 && (
              <p css={s.muted}>이번 주 이용 횟수를 모두 썼어요. {kstLabel(quota.resetsAt)}에 다시 3회가 돼요.</p>
            )}
          </form>
        </>
      )}

      {startM.isError && !startM.isPending && <ErrorNotice error={startM.error} onRetry={() => sent && submit(sent)} />}
    </section>
  );
}

// ---------- 대화 ----------

function Thread({ conv, quota, onNew }: { conv: AssistantConversation; quota?: AssistantQuota; onNew: () => void }) {
  const sendM = useSendAssistantMessage();
  const deleteM = useDeleteAssistantConversation();
  const idem = useIdempotencyKey();
  const [text, setText] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const trimmed = text.trim();
  const closed = conv.status === "CLOSED" || conv.remainingQuestions <= 0;
  const blocked = closed || conv.inFlight || (!!quota && !quota.available);

  const submit = (value = trimmed) => {
    if (!value || sendM.isPending) return;
    setSent(value);
    sendM.mutate(
      { conversationId: conv.conversationId, message: value, idempotencyKey: idem.keyFor(value) },
      {
        onSuccess: () => {
          idem.settle(null);
          setText("");
        },
        onError: (e) => idem.settle(e),
      },
    );
  };

  return (
    <section css={s.panel} aria-labelledby="assistant-thread-title">
      <div css={s.threadHead}>
        <h2 id="assistant-thread-title">{conv.title}</h2>
        <div css={s.quota}>
          <span css={s.quotaChip(false)}>
            질문 {conv.userMessageCount}/{conv.maxUserMessages} · 남은 {conv.remainingQuestions}번
          </span>
          <button type="button" css={s.textBtn} onClick={() => setConfirmDelete(true)} disabled={conv.inFlight}>
            삭제
          </button>
        </div>
      </div>
      <p css={s.muted}>
        {conv.styleContext
          ? `취향 진단 반영 중: ${[...conv.styleContext.recommended, conv.styleContext.region].filter(Boolean).join(" · ")} — 반영하지 않으려면 새 대화에서 체크를 풀어 주세요.`
          : "취향 진단 없이 대화 내용으로만 찾고 있어요."}
      </p>

      <ol css={s.messages}>
        {conv.messages.map((m) =>
          m.role === "USER" ? (
            <li key={m.messageId} css={s.userBubble}>
              {m.content}
            </li>
          ) : (
            <li key={m.messageId} css={s.answer}>
              <div css={s.answerText}>{m.content}</div>
              {m.recommendations.length === 0 && !m.followUpQuestion && (
                <p css={s.followUp}>조건에 맞는 공개 레슨을 찾지 못했어요. 지역·악기·시간 조건을 바꿔 다시 물어보세요.</p>
              )}
              <AssistantCards cards={m.recommendations} />
              {m.followUpQuestion && <p css={s.followUp}>{m.followUpQuestion}</p>}
            </li>
          ),
        )}
        {sendM.isPending && (
          <>
            <li css={s.userBubble}>{sent}</li>
            <li>
              <Waiting />
            </li>
          </>
        )}
      </ol>

      {sendM.isError && !sendM.isPending && <ErrorNotice error={sendM.error} onRetry={() => sent && submit(sent)} onNew={onNew} />}

      {closed ? (
        <div css={s.notice("info")}>
          <strong>이 대화의 질문 6번을 모두 썼어요</strong>
          새 대화를 시작하면 이번 주 이용 횟수 1회를 써요.
          <div css={s.noticeActions}>
            <button type="button" css={s.secondaryBtn} onClick={onNew}>
              새 대화 시작
            </button>
          </div>
        </div>
      ) : (
        <form
          css={s.composer}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor="assistant-follow" css={s.srOnly}>
            이어서 질문
          </label>
          <textarea
            id="assistant-follow"
            css={s.textarea}
            style={{ minHeight: 72 }}
            value={text}
            maxLength={ASSISTANT_MESSAGE_MAX}
            disabled={blocked || sendM.isPending}
            placeholder="조건을 더 알려 주거나 궁금한 점을 물어보세요. (이번 주 이용 횟수는 줄지 않아요)"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <div css={s.composerRow}>
            <span css={s.counter}>
              {text.length}/{ASSISTANT_MESSAGE_MAX}
            </span>
            <button type="submit" css={s.primaryBtn} disabled={!trimmed || blocked || sendM.isPending}>
              보내기
            </button>
          </div>
        </form>
      )}

      <ConfirmModal
        open={confirmDelete}
        title="대화 삭제"
        message="이 대화 기록을 지울까요? 지운 기록은 되돌릴 수 없고, 이번 주 이용 횟수는 돌아오지 않아요."
        confirmText="삭제"
        cancelText="취소"
        loading={deleteM.isPending}
        onConfirm={() =>
          deleteM.mutate(conv.conversationId, {
            onSettled: () => {
              setConfirmDelete(false);
              onNew();
            },
          })
        }
        onClose={() => setConfirmDelete(false)}
      />
    </section>
  );
}

export default AssistantPage;
