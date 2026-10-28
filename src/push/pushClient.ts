import { instance } from "../apis/instance/instance";
import type { ApiRespDto } from "../Types/responseType";
import { detectPushEnv } from "./pushEnv";

/*
 * 웹 푸시 구독 (표준 Web Push + VAPID)
 *  - 서비스 워커: /sw.js (알림 표시·클릭만, 캐시 없음)
 *  - 구독은 로그인한 계정에 연결 (서버가 토큰으로 판단, userId 를 보내지 않음)
 *  - "이 기기에서 이 계정 알림 받기" 선택은 브라우저에 계정별로 기억 (pushPrefKey)
 *  - 로그아웃하면 브라우저 구독 자체를 해제 -> 이전 계정 알림이 이 기기에 오지 않음
 */

const SW_URL = "/sw.js";
const pushPrefKey = (userId: number) => `muzin.push.on.u${userId}`;

type PushConfig = { enabled: boolean; publicKey: string | null };

let configCache: Promise<PushConfig> | null = null;
export const getPushConfig = () => {
  configCache ??= instance
    .get<ApiRespDto<PushConfig>>("/push/config")
    .then((r) => r.data.data)
    .catch((e) => {
      configCache = null;
      throw e;
    });
  return configCache;
};

const readPref = (userId: number) => {
  try {
    return localStorage.getItem(pushPrefKey(userId)) === "1";
  } catch {
    return false;
  }
};
const writePref = (userId: number, on: boolean) => {
  try {
    if (on) localStorage.setItem(pushPrefKey(userId), "1");
    else localStorage.removeItem(pushPrefKey(userId));
  } catch {
    // 저장이 막힌 브라우저
  }
};

const b64ToBytes = (b64: string) => {
  const s = atob((b64 + "=".repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
};

const sameKey = (a: ArrayBuffer | null | undefined, b: Uint8Array) => {
  if (!a) return false;
  const x = new Uint8Array(a);
  return x.length === b.length && x.every((v, i) => v === b[i]);
};

const getRegistration = async () => {
  if (!("serviceWorker" in navigator)) return null;
  return (await navigator.serviceWorker.getRegistration("/")) ?? null;
};

const register = async () => {
  await navigator.serviceWorker.register(SW_URL, { scope: "/" });
  return navigator.serviceWorker.ready;
};

const sendToServer = (sub: PushSubscription) => {
  const json = sub.toJSON();
  return instance.put("/push/subscriptions", { endpoint: json.endpoint, keys: json.keys });
};

// 브라우저 구독을 만들거나(키가 바뀌었으면 새로) 서버에 이 계정으로 등록
async function ensureSubscribed(): Promise<PushSubscription> {
  const config = await getPushConfig();
  if (!config.enabled || !config.publicKey) throw new Error("PUSH_DISABLED");
  const key = b64ToBytes(config.publicKey);
  const reg = await register();
  let sub = await reg.pushManager.getSubscription();
  if (sub && !sameKey(sub.options.applicationServerKey, key)) {
    await sub.unsubscribe(); // 서버 키가 바뀐 예전 구독
    sub = null;
  }
  sub ??= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
  await sendToServer(sub);
  return sub;
}

export type EnableResult = "on" | "denied" | "dismissed" | "unavailable" | "error";

// "알림 켜기" 버튼에서만 호출 (권한 요청은 사용자가 직접 눌렀을 때만)
export async function enablePush(userId: number): Promise<EnableResult> {
  if (detectPushEnv().readiness !== "ready") return "unavailable";
  // 아이폰 Safari 는 버튼을 누른 흐름 안에서 바로 요청해야 해서 다른 await 보다 먼저
  const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
  if (permission === "denied") return "denied";
  if (permission !== "granted") return "dismissed";
  try {
    await ensureSubscribed();
    writePref(userId, true);
    return "on";
  } catch (e) {
    return e instanceof Error && e.message === "PUSH_DISABLED" ? "unavailable" : "error";
  }
}

// 이 기기에서 이 계정 알림 끄기 (권한은 그대로, 다시 켤 때 묻지 않음)
export async function disablePush(userId: number) {
  writePref(userId, false);
  const sub = await (await getRegistration())?.pushManager.getSubscription();
  if (!sub) return;
  await instance.post("/push/subscriptions/delete", { endpoint: sub.endpoint }).catch(() => undefined);
  await sub.unsubscribe().catch(() => undefined);
}

// 이 브라우저 구독이 지금 계정에 연결돼 있는지
export async function isPushOnForThisDevice(): Promise<boolean> {
  if (detectPushEnv().readiness !== "ready" || Notification.permission !== "granted") return false;
  const sub = await (await getRegistration())?.pushManager.getSubscription();
  if (!sub) return false;
  const r = await instance.post<ApiRespDto<{ subscribed: boolean }>>("/push/subscriptions/status", { endpoint: sub.endpoint });
  return r.data.data.subscribed;
}

/*
 * 로그인(새로고침 포함) 후 한 번: 이 기기 구독을 지금 계정에 맞춤
 *  - 이 계정이 이 기기에서 알림을 켰고 권한이 있으면 -> 구독을 만들고/갱신해서 등록 (권한 창은 띄우지 않음)
 *  - 켜지 않은 계정인데 브라우저에 다른 계정 구독이 남아 있으면 -> 해제
 */
export async function syncPushForUser(userId: number) {
  try {
    if (detectPushEnv().readiness !== "ready") return;
    const reg = await getRegistration();
    if (readPref(userId) && Notification.permission === "granted") {
      await ensureSubscribed();
    } else {
      const sub = await reg?.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
    }
  } catch {
    // 다음 접속 때 다시 시도
  }
}

/*
 * 로그아웃 직전: 서버에서 이 기기 구독을 지우고(토큰이 아직 있을 때) 브라우저 구독도 해제
 *  - 서버 요청이 실패해도 브라우저 구독을 해제하므로 푸시 서버가 410 으로 답하고 서버에서 정리됨
 *  - 계정별 "알림 켜기" 기억은 남겨서 같은 계정으로 다시 로그인하면 자동으로 다시 연결
 */
export async function detachPushOnLogout(token: string | null) {
  try {
    const sub = await (await getRegistration())?.pushManager.getSubscription();
    if (!sub) return;
    if (token) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/push/subscriptions/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` },
        body: JSON.stringify({ endpoint: sub.endpoint }),
        keepalive: true,
      }).catch(() => undefined);
    }
    await sub.unsubscribe();
  } catch {
    // 서비스 워커를 못 쓰는 환경
  }
}
