// 웹 푸시를 쓸 수 있는 환경인지 (기기 종류 + 실제 기능 지원 + 홈 화면 웹앱 실행 여부)
//  - 아이폰·아이패드: iOS/iPadOS 16.4 이상, 홈 화면에 추가한 웹앱으로 열었을 때만 가능
//  - 안드로이드·PC: 지원 브라우저면 설치 없이 가능
//  - 카카오톡·인스타그램 등 앱 안 브라우저는 대부분 불가

export type PushPlatform = "ios" | "android" | "desktop";

export type PushReadiness =
  | "ready" // 지금 이 화면에서 알림 켜기 가능
  | "ios-install" // 아이폰: 홈 화면에 추가 후 그 아이콘으로 열어야 함
  | "ios-old" // 아이폰: iOS 16.4 미만
  | "in-app" // 앱 안 브라우저
  | "insecure" // https 가 아님
  | "unsupported"; // 그 외 기능 미지원 브라우저

export type PushEnv = {
  platform: PushPlatform;
  standalone: boolean; // 홈 화면 웹앱으로 실행 중
  readiness: PushReadiness;
};

const IN_APP = /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|FB_IAB|Line\/|DaumApps|everytimeApp|BAND\/|; wv\)/i;

const iosVersion = (ua: string): number | null => {
  const m = ua.match(/OS (\d+)[_.](\d+)/) ?? ua.match(/Version\/(\d+)\.(\d+)/);
  return m ? Number(m[1]) + Number(m[2]) / 100 : null;
};

export function detectPushEnv(): PushEnv {
  const ua = navigator.userAgent;
  // iPadOS 13+ 는 맥처럼 보이는 UA 를 씀 -> 터치 지원으로 구분
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const platform: PushPlatform = ios ? "ios" : android ? "android" : "desktop";
  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

  let readiness: PushReadiness;
  if (!window.isSecureContext) readiness = "insecure";
  else if (IN_APP.test(ua)) readiness = "in-app";
  else if (ios) {
    const v = iosVersion(ua);
    if (v != null && v < 16.04) readiness = "ios-old";
    else if (!standalone) readiness = "ios-install";
    else readiness = supported ? "ready" : "unsupported";
  } else readiness = supported ? "ready" : "unsupported";

  return { platform, standalone, readiness };
}

export const notificationPermission = (): NotificationPermission | "unsupported" =>
  "Notification" in window ? Notification.permission : "unsupported";
