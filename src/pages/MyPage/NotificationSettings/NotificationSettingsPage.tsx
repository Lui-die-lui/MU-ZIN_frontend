/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import * as p from "../../../components/push/styles";
import PushEnablePanel from "../../../components/push/PushEnablePanel";
import PushGuideModal from "../../../components/push/PushGuideModal";
import { detectPushEnv, isSamsungBrowser, type PushPlatform } from "../../../push/pushEnv";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { ackGuide } from "../../../push/pushGuideStorage";

const READINESS_TEXT = {
  "ios-install": "아이폰·아이패드는 MU:ZIN 을 홈 화면에 추가하고, 그 아이콘으로 열었을 때 알림을 켤 수 있어요.",
  "ios-old": "iOS·iPadOS 16.4 이상에서 알림을 받을 수 있어요. 설정 > 일반 > 소프트웨어 업데이트를 확인해 주세요.",
  "in-app": "앱 안에서 연 브라우저에서는 알림을 받을 수 없어요. Safari·Chrome 같은 기본 브라우저로 열어 주세요.",
  insecure: "보안 연결(https)에서만 알림을 켤 수 있어요.",
  unsupported: "이 브라우저는 웹 알림을 지원하지 않아요. 최신 Chrome·Edge·Firefox·삼성 인터넷 등에서 열어 주세요.",
} as const;

// 알림이 오지 않을 때 확인할 것 - 지금 기기 종류에 맞는 것만 (메뉴 이름은 기기·버전마다 조금 다를 수 있음)
type Check = { title: string; desc: string };
const checklist = (platform: PushPlatform, samsung: boolean): Check[] => {
  const common: Check = {
    title: "이 기기에서 알림을 켰나요?",
    desc: "위 '이 기기 알림'에서 '알림을 받고 있어요'가 보이는지 확인해 주세요. 휴대폰·컴퓨터마다 따로 켜야 하고, 로그아웃하면 이 기기 알림도 멈췄다가 같은 계정으로 다시 로그인하면 이어져요.",
  };
  if (platform === "ios") {
    return [
      common,
      { title: "홈 화면 아이콘으로 열었나요?", desc: "아이폰은 홈 화면에 추가한 MU:ZIN 아이콘으로 열었을 때만 알림을 받을 수 있어요. Safari 에서 연 화면에서는 오지 않아요." },
      { title: "아이폰 알림이 켜져 있나요?", desc: "아이폰 설정 > 알림 > MU:ZIN 에서 '알림 허용'을 켜 주세요." },
      { title: "집중 모드가 켜져 있지 않나요?", desc: "방해 금지·수면 같은 집중 모드에서는 알림이 보이지 않을 수 있어요." },
    ];
  }
  if (platform === "android") {
    const app = samsung ? "삼성 인터넷" : "사용 중인 브라우저(Chrome 등)";
    return [
      common,
      {
        title: "브라우저에서 알림을 허용했나요?",
        desc: samsung
          ? "삼성 인터넷 메뉴(≡) > 설정 > 사이트 및 다운로드 > 알림에서 mu-zin.com 을 허용해 주세요."
          : "브라우저 메뉴(⋮) > 설정 > 사이트 설정 > 알림에서 mu-zin.com 을 허용해 주세요.",
      },
      { title: "휴대폰에서 브라우저 알림이 켜져 있나요?", desc: `휴대폰 설정 > 애플리케이션 > ${app} > 알림을 켜 주세요.` },
      {
        title: "배터리·데이터 제한에 묶여 있지 않나요?",
        desc: `휴대폰 설정 > 애플리케이션 > ${app} > 배터리를 '제한 없음'으로, 모바일 데이터에서 백그라운드 데이터를 허용해 주세요. 절전 앱 목록에 있거나 데이터 절약 모드가 켜져 있으면 알림이 늦거나 오지 않고, 알림 켜기가 멈출 수도 있어요.`,
      },
      ...(samsung ? [{ title: "비밀 모드가 아닌가요?", desc: "삼성 인터넷 비밀 모드에서는 알림을 받을 수 없어요. 일반 모드로 열어 주세요." }] : []),
    ];
  }
  return [
    common,
    { title: "브라우저에서 알림을 허용했나요?", desc: "주소창 왼쪽의 사이트 정보 아이콘을 눌러 알림을 '허용'으로 바꿔 주세요." },
    { title: "컴퓨터 알림이 켜져 있나요?", desc: "컴퓨터의 방해 금지·집중 모드를 끄고, 알림 설정에서 브라우저 알림을 허용해 주세요." },
    { title: "브라우저가 켜져 있나요?", desc: "컴퓨터에서는 브라우저가 실행 중일 때 알림을 받을 수 있어요." },
  ];
};

// 푸시로 보내는 소식 (서버 PushEventListener 와 같게)
const TOPICS = [
  { title: "새 채팅 메시지", desc: "아티스트·수강생이 보낸 메시지가 오면 알려 드려요." },
  { title: "예약 소식", desc: "예약 요청이 들어오거나, 확정·거절·취소·만료·완료되면 알려 드려요." },
  { title: "레슨 문의", desc: "문의가 도착하거나, 답변이 오거나, 채팅으로 이어지면 알려 드려요." },
  { title: "리뷰", desc: "내 레슨에 리뷰가 달리거나, 내 리뷰에 답글이 달리면 알려 드려요." },
  { title: "아티스트 신청 결과", desc: "아티스트 신청이 승인되거나 반려되면 알려 드려요." },
  { title: "운영자 문의 답변", desc: "운영자에게 보낸 문의에 답변이 달리면 알려 드려요." },
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
  const checks = checklist(env.platform, isSamsungBrowser());
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

      <section css={s.card}>
        <div>
          <h2 css={s.cardTitle}>알림이 오지 않나요?</h2>
          <p css={s.cardDesc}>아래를 차례로 확인해 주세요. 지금 쓰는 기기에 맞는 내용만 보여 드려요.</p>
        </div>
        <ol css={s.checkList}>
          {checks.map((c) => (
            <li key={c.title}>
              <b>{c.title}</b>
              <span>{c.desc}</span>
            </li>
          ))}
        </ol>
        <div css={s.helpRow}>
          <p css={s.note}>그래도 오지 않으면 운영자 문의로 기기와 브라우저 이름을 알려 주세요.</p>
          <button type="button" css={p.secondaryBtn} onClick={() => setGuideOpen(true)}>
            설정 안내 다시 보기
          </button>
        </div>
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
