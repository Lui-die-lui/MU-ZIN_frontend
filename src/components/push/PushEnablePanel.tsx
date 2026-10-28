/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import { usePushStatus } from "./usePushStatus";
import { usePrincipalState } from "../../stores/usePrincipalState";
import type { PushPlatform } from "../../push/pushEnv";
import { toast } from "../../stores/useToastStore";

// 권한이 거부됐을 때 바꾸는 곳 (다시 요청하지 않고 설정에서 바꾸도록 안내)
const DENIED_HELP: Record<PushPlatform, string> = {
  ios: "아이폰 설정 > 알림 > MU:ZIN 에서 '알림 허용'을 켜 주세요.",
  android: "브라우저 메뉴(⋮) > 설정 > 사이트 설정 > 알림에서 mu-zin.com 을 허용해 주세요. 휴대폰 설정에서 브라우저나 MU:ZIN 앱 알림이 꺼져 있어도 받을 수 없어요.",
  desktop: "주소창 왼쪽의 사이트 정보 아이콘을 눌러 알림을 '허용'으로 바꿔 주세요. 컴퓨터의 방해 금지·알림 설정도 확인해 주세요.",
};

type Props = { showOff?: boolean }; // 설정 화면: 끄기 버튼까지

// "알림 켜기" - 권한 요청은 이 버튼을 눌렀을 때만
function PushEnablePanel({ showOff = false }: Props) {
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const { env, permission, serverEnabled, on, busy, enable, disable, refresh } = usePushStatus(userId);
  const [result, setResult] = useState<string | null>(null);

  if (env.readiness !== "ready") return null; // 설치·브라우저 안내는 안내 카드가 함
  if (serverEnabled === false) {
    return <p css={s.note}>지금은 알림 기능을 준비 중이에요. 잠시 후 다시 확인해 주세요.</p>;
  }

  const onEnable = async () => {
    setResult(null);
    const r = await enable();
    if (r === "on") toast.success("이 기기에서 알림을 받아요.");
    else if (r === "dismissed") setResult("알림 요청 창이 닫혔어요. 다시 눌러 허용해 주세요.");
    else if (r === "unavailable") setResult("지금은 알림을 켤 수 없어요. 잠시 후 다시 시도해 주세요.");
    else if (r === "error") setResult("알림을 켜지 못했어요. 네트워크를 확인하고 다시 시도해 주세요.");
  };

  if (permission === "denied") {
    return (
      <div css={s.status("warn")} role="status">
        <strong>알림이 차단되어 있어요</strong>
        <p>{DENIED_HELP[env.platform]}</p>
        <button type="button" css={s.secondaryBtn} onClick={() => void refresh()}>
          바꿨어요, 다시 확인
        </button>
      </div>
    );
  }

  if (on) {
    return (
      <div css={s.status("ok")} role="status">
        <strong>이 기기에서 알림을 받고 있어요</strong>
        <p>새 메시지와 예약 소식을 알려 드려요. 휴대폰 설정이나 네트워크에 따라 늦거나 보이지 않을 수 있어요.</p>
        {showOff && (
          <button type="button" css={s.secondaryBtn} onClick={() => void disable()} disabled={busy}>
            {busy ? "끄는 중..." : "이 기기에서 알림 끄기"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div css={s.enableBox}>
      <button type="button" css={s.primaryBtn} onClick={onEnable} disabled={busy || on === null}>
        {busy ? "켜는 중..." : permission === "granted" ? "이 기기에서 알림 받기" : "알림 켜기"}
      </button>
      <p css={s.note}>
        {permission === "granted"
          ? "알림 권한은 이미 허용되어 있어요. 버튼을 누르면 이 계정 알림을 받아요."
          : "버튼을 누르면 브라우저가 알림 허용을 물어봐요. '허용'을 선택해 주세요."}
      </p>
      {result && (
        <p css={s.note} role="alert">
          {result}
        </p>
      )}
    </div>
  );
}

export default PushEnablePanel;
