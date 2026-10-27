/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as s from "./styles";
import ReportButton from "../../../components/report/ReportButton";
import MypageTabBar from "../../../components/common/MypageTabBar/MypageTabBar";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import { useInquiryToChat, useReceivedInquiries, useReplyInquiry, useSentInquiries } from "../../../hooks/chat/useChat";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { INQUIRY_MAX, type Inquiry } from "../../../Types/chatTypes";
import { formatDateTime } from "../../../utils/reservationFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";

type Tab = "sent" | "received";

const STATUS_LABEL: Record<Inquiry["status"], string> = {
  OPEN: "답변 대기",
  REPLIED: "답변 완료",
  CHAT: "채팅으로 이어짐",
};

// 마이페이지 > 문의 (?tab=sent|received)
//  - 보낸 문의: 답변 확인, 채팅으로 이어졌으면 채팅방으로
//  - 받은 문의(승인 아티스트): 답변하기(한 번) 또는 채팅으로 이어가기(14일 동안 대화)
function InquiriesPage() {
  const isArtist = usePrincipalState((st) => st.principal?.artistStatus === "APPROVED");
  const [params, setParams] = useSearchParams();
  const sentQ = useSentInquiries();
  const receivedQ = useReceivedInquiries(isArtist);

  const tabs: { key: Tab; label: string }[] = [
    { key: "sent", label: "보낸 문의" },
    ...(isArtist ? [{ key: "received" as Tab, label: "받은 문의" }] : []),
  ];
  const raw = params.get("tab") as Tab | null;
  const tab: Tab = tabs.some((t) => t.key === raw) ? raw! : isArtist && !raw ? "received" : "sent";
  const openCount = receivedQ.data?.filter((i) => i.status === "OPEN").length ?? 0;
  const q = tab === "sent" ? sentQ : receivedQ;

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>문의</h1>
        <p css={s.desc}>레슨 목록에 없는 레슨도 아티스트에게 문의할 수 있어요. 아티스트는 답변하거나 채팅으로 이어갈 수 있어요.</p>
      </div>

      <MypageTabBar
        value={tab}
        items={tabs.map((t) => ({ key: t.key, label: t.key === "received" && openCount ? `${t.label} ${openCount}` : t.label }))}
        onChange={(next) => setParams({ tab: next })}
      />

      {q.isLoading ? (
        <div css={s.stateBox}>불러오는 중...</div>
      ) : q.isError ? (
        <div css={s.stateBox}>
          문의를 불러오지 못했어요.
          <button type="button" css={s.textBtn} onClick={() => q.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : !q.data?.length ? (
        <div css={s.stateBox}>
          {tab === "sent" ? (
            <>
              아직 보낸 문의가 없어요.
              <Link to="/artists" css={s.textBtn}>
                아티스트 찾아보기
              </Link>
            </>
          ) : (
            "아직 받은 문의가 없어요."
          )}
        </div>
      ) : (
        <ul css={s.list}>
          {q.data.map((i) => (
            <InquiryItem key={i.inquiryId} inquiry={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

function InquiryItem({ inquiry: i }: { inquiry: Inquiry }) {
  const navigate = useNavigate();
  const replyM = useReplyInquiry();
  const toChatM = useInquiryToChat();
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const artistView = i.myRole === "ARTIST";
  const busy = replyM.isPending || toChatM.isPending;

  const reply = async () => {
    if (!text.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }
    try {
      await replyM.mutateAsync({ inquiryId: i.inquiryId, content: text.trim() });
      toast.success("답변했어요. 문의한 분에게 알림이 가요.");
      setReplying(false);
    } catch (e) {
      setError(getErrorMessage(e, "답변하지 못했어요."));
    }
  };

  const toChat = async () => {
    try {
      const res = await toChatM.mutateAsync(i.inquiryId);
      toast.success("채팅방을 열었어요. 14일 동안 대화할 수 있어요.");
      if (res.chatRoomId) navigate(`/mypage/chats/${res.chatRoomId}`);
    } catch (e) {
      toast.error(getErrorMessage(e, "채팅으로 넘기지 못했어요."));
    }
  };

  return (
    <li css={s.item}>
      <div css={s.itemHead}>
        <ProfileAvatar
          src={artistView ? i.userProfileImgUrl : i.artistProfileImgUrl}
          name={artistView ? i.userName : i.artistName}
          size={36}
        />
        <div css={s.who}>
          {artistView ? <strong>{i.userName}</strong> : <Link to={`/artists/${i.artistProfileId}`}>{i.artistName}</Link>}
          <span>{formatDateTime(i.createDt)}</span>
        </div>
        <span css={s.status(i.status)}>{STATUS_LABEL[i.status]}</span>
        {artistView && (
          <ReportButton targetType="INQUIRY" targetId={i.inquiryId} targetName={`${i.userName}님의 문의`} targetUserId={i.userId} />
        )}
      </div>

      <p css={s.content}>{i.content}</p>

      {i.replyContent && (
        <div css={s.reply}>
          <span css={s.replyLabel}>{artistView ? "내 답변" : `${i.artistName}님의 답변`}</span>
          <p>{i.replyContent}</p>
        </div>
      )}

      {i.status === "CHAT" &&
        (i.chatRoomId ? (
          <div css={s.actions}>
            <button type="button" css={s.btn(true)} onClick={() => navigate(`/mypage/chats/${i.chatRoomId}`)}>
              채팅방으로
            </button>
          </div>
        ) : (
          <p css={s.muted}>채팅방이 삭제됐어요.</p>
        ))}

      {artistView && i.status !== "CHAT" && (
        <>
          {replying ? (
            <div css={s.replyBox}>
              <label htmlFor={`reply-${i.inquiryId}`} css={s.srOnly}>
                답변
              </label>
              <textarea
                id={`reply-${i.inquiryId}`}
                css={s.textarea}
                rows={4}
                maxLength={INQUIRY_MAX}
                autoFocus
                placeholder="레슨 가능 여부, 시간, 준비물 등을 알려주세요."
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
              <div css={s.actions}>
                <button type="button" css={s.btn(false)} onClick={() => setReplying(false)} disabled={busy}>
                  취소
                </button>
                <button type="button" css={s.btn(true)} onClick={reply} disabled={busy}>
                  {replyM.isPending ? "보내는 중..." : "답변 보내기"}
                </button>
              </div>
            </div>
          ) : (
            <div css={s.actions}>
              {i.status === "OPEN" && (
                <button type="button" css={s.btn(false)} onClick={() => setReplying(true)} disabled={busy}>
                  답변하기
                </button>
              )}
              <button type="button" css={s.btn(i.status === "REPLIED")} onClick={toChat} disabled={busy}>
                {toChatM.isPending ? "여는 중..." : "채팅으로 이어가기"}
              </button>
            </div>
          )}
          {!replying && <p css={s.muted}>채팅으로 이어가면 문의{i.replyContent ? "와 답변" : ""}이 첫 메시지가 되고, 14일 동안 대화할 수 있어요.</p>}
        </>
      )}
    </li>
  );
}

export default InquiriesPage;
