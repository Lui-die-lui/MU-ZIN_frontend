/* MU:ZIN 서비스 워커 - 웹 푸시 알림만 처리 (요청 가로채기·캐시 없음: API 응답과 로그인 정보는 저장하지 않음) */

// 알림을 눌렀을 때 열 수 있는 경로 (서버 PushMessage.ALLOWED_URL 과 같은 규칙)
const ALLOWED = /^\/mypage\/(chats(\/\d+)?|reservations(\/requests)?)$/;
const FALLBACK = "/mypage";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const safePath = (url) => (typeof url === "string" && ALLOWED.test(url) ? url : FALLBACK);

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  const tag = typeof data.tag === "string" && data.tag ? data.tag : undefined;
  // 잠금화면에 보일 수 있어 서버도 상대 이름·내용 없이 짧은 문구만 보냄
  event.waitUntil(
    self.registration.showNotification(typeof data.title === "string" ? data.title : "MU:ZIN", {
      body: typeof data.body === "string" ? data.body : "새 소식이 있어요",
      icon: "/icon-192.png",
      tag, // 같은 대화방·예약 알림은 하나로 묶음
      renotify: !!tag,
      data: { url: safePath(data.url) },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(safePath(event.notification.data && event.notification.data.url), self.location.origin).href;

  event.waitUntil(
    (async () => {
      const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      // 이미 열린 MU:ZIN 화면이 있으면 그 창에서 이동 (로그인이 필요하면 앱이 로그인 후 이 화면으로 돌려보냄)
      for (const client of list) {
        if (new URL(client.url).origin !== self.location.origin) continue;
        try {
          await client.focus();
          if ("navigate" in client) {
            await client.navigate(target);
            return;
          }
        } catch {
          // 이동이 막힌 창이면 새 창으로
        }
      }
      await self.clients.openWindow(target);
    })(),
  );
});

// 브라우저가 구독을 바꾼 경우 새 구독을 받아 둠. 서버 등록은 앱을 다시 열 때 로그인 정보로 갱신
self.addEventListener("pushsubscriptionchange", (event) => {
  const options = event.oldSubscription && event.oldSubscription.options;
  if (!options) return;
  event.waitUntil(self.registration.pushManager.subscribe(options).catch(() => undefined));
});
