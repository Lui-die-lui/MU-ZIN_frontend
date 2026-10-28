/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "../Reviews/styles";
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

// 마이페이지 > 알림 설정 - 이 기기 알림 켜기/끄기 + 안내 다시 보기
function NotificationSettingsPage() {
  const [env] = useState(detectPushEnv);
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>알림 설정</h1>
        <p css={s.desc}>
          새 채팅 메시지와 예약 확정·거절·취소 소식을 이 기기로 알려 드려요. 기기마다 따로 켜야 하고, 휴대폰 설정이나 네트워크에 따라 알림이 늦거나
          보이지 않을 수 있어요.
        </p>
      </div>

      {env.readiness === "ready" ? (
        <PushEnablePanel showOff />
      ) : (
        <div css={p.status("warn")}>
          <strong>이 화면에서는 알림을 켤 수 없어요</strong>
          <p>{READINESS_TEXT[env.readiness]}</p>
        </div>
      )}

      <div>
        <button type="button" css={p.secondaryBtn} onClick={() => setGuideOpen(true)}>
          알림 설정 안내 다시 보기
        </button>
      </div>

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
