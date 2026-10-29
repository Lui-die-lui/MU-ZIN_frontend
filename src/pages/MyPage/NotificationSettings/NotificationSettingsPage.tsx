/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import * as p from "../../../components/push/styles";
import PushEnablePanel from "../../../components/push/PushEnablePanel";
import PushGuideModal from "../../../components/push/PushGuideModal";
import { detectPushEnv } from "../../../push/pushEnv";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { ackGuide } from "../../../push/pushGuideStorage";

const READINESS_TEXT = {
  "ios-install": "아이폰·아이패드는 MU:ZIN 을 홈 화면에 추가하고, 그 아이콘으로 열었을 때 알림을 켤 수 있어요.",
  "ios-old": "iOS·iPadOS 16.4 이상에서 알림을 받을 수 있어요. 설정 > 일반 > 소프트웨어 업데이트를 확인해 주세요.",
  "in-app": "앱 안에서 연 브라우저에서는 알림을 받을 수 없어요. Safari·Chrome 같은 기본 브라우저로 열어 주세요.",
  insecure: "보안 연결(https)에서만 알림을 켤 수 있어요.",
  unsupported: "이 브라우저는 웹 알림을 지원하지 않아요. 최신 Chrome·Edge·Firefox·삼성 인터넷 등에서 열어 주세요.",
} as const;

// 푸시로 보내는 소식 (서버 PushEventListener 와 같게)
const TOPICS = [
  { title: "새 채팅 메시지", desc: "아티스트·수강생이 보낸 메시지가 오면 알려 드려요." },
  { title: "예약 소식", desc: "예약 요청이 들어오거나, 확정·거절·취소·만료되면 알려 드려요." },
];

const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

// 마이페이지 > 알림 설정 - 이 기기 알림 켜기/끄기 + 안내 다시 보기
function NotificationSettingsPage() {
  const [env] = useState(detectPushEnv);
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>알림 설정</h1>
        <p css={s.desc}>MU:ZIN 을 열어 두지 않아도 새 소식을 이 기기로 알려 드려요.</p>
      </div>

      <section css={s.card}>
        <div css={s.cardHead}>
          <span css={s.icon}>
            <BellIcon />
          </span>
          <div>
            <h2 css={s.cardTitle}>이 기기 알림</h2>
            <p css={s.cardDesc}>휴대폰·컴퓨터마다 따로 켜야 해요.</p>
          </div>
        </div>

        {env.readiness === "ready" ? (
          <PushEnablePanel showOff />
        ) : (
          <div css={p.status("warn")}>
            <strong>이 화면에서는 알림을 켤 수 없어요</strong>
            <p>{READINESS_TEXT[env.readiness]}</p>
          </div>
        )}
      </section>

      <section css={s.card}>
        <h2 css={s.cardTitle}>알림으로 받는 소식</h2>
        <ul css={s.topicList}>
          {TOPICS.map((t) => (
            <li key={t.title}>
              <b>{t.title}</b>
              <span>{t.desc}</span>
            </li>
          ))}
        </ul>
        <p css={s.note}>휴대폰 설정이나 네트워크 상태에 따라 알림이 늦거나 보이지 않을 수 있어요.</p>
      </section>

      <section css={[s.card, s.helpRow]}>
        <div>
          <h2 css={s.cardTitle}>알림이 오지 않나요?</h2>
          <p css={s.cardDesc}>기기별로 알림을 켜는 방법을 다시 볼 수 있어요.</p>
        </div>
        <button type="button" css={p.secondaryBtn} onClick={() => setGuideOpen(true)}>
          설정 안내 다시 보기
        </button>
      </section>

      {guideOpen && (
        <PushGuideModal
          open
          onLater={() => setGuideOpen(false)}
          onDone={() => {
            if (userId != null) ackGuide(userId);
            setGuideOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default NotificationSettingsPage;
