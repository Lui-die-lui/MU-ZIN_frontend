// 안드로이드 Chrome 등에서 "홈 화면에 추가(앱 설치)" 창을 직접 띄울 수 있게 이벤트를 보관
//  - 브라우저가 beforeinstallprompt 를 보냈을 때만 설치 버튼을 보여줌 (못 쓰는 버튼은 안 보임)
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function initInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // 브라우저 기본 안내 대신 우리 버튼으로
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

export const canInstall = () => deferred != null;

export const subscribeInstall = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const e = deferred;
  deferred = null; // 한 번만 쓸 수 있음
  emit();
  await e.prompt();
  return (await e.userChoice).outcome === "accepted";
}
