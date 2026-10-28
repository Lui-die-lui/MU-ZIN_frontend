import { useCallback, useEffect, useState } from "react";
import { detectPushEnv, notificationPermission } from "../../push/pushEnv";
import { disablePush, enablePush, getPushConfig, isPushOnForThisDevice, type EnableResult } from "../../push/pushClient";

// 이 기기에서 알림 상태 (환경 · 권한 · 서버 설정 · 지금 계정으로 구독 중인지)
export function usePushStatus(userId: number | null) {
  const [env] = useState(detectPushEnv);
  const [permission, setPermission] = useState(notificationPermission);
  const [serverEnabled, setServerEnabled] = useState<boolean | null>(null);
  const [on, setOn] = useState<boolean | null>(null); // null = 확인 중
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const enabled = await getPushConfig().then((c) => c.enabled).catch(() => null);
    const subscribed = await isPushOnForThisDevice().catch(() => false);
    setServerEnabled(enabled);
    setOn(subscribed);
    setPermission(notificationPermission());
  }, []);

  useEffect(() => {
    void refresh();
    // 브라우저 설정에서 권한을 바꾸고 돌아온 경우
    let status: PermissionStatus | null = null;
    navigator.permissions
      ?.query({ name: "notifications" as PermissionName })
      .then((s) => {
        status = s;
        s.onchange = () => void refresh();
      })
      .catch(() => undefined);
    const onVisible = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      if (status) status.onchange = null;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const enable = useCallback(async (): Promise<EnableResult> => {
    if (userId == null) return "error";
    setBusy(true);
    try {
      const r = await enablePush(userId);
      await refresh();
      return r;
    } finally {
      setBusy(false);
    }
  }, [userId, refresh]);

  const disable = useCallback(async () => {
    if (userId == null) return;
    setBusy(true);
    try {
      await disablePush(userId);
      await refresh();
    } finally {
      setBusy(false);
    }
  }, [userId, refresh]);

  return { env, permission, serverEnabled, on, busy, enable, disable, refresh };
}
