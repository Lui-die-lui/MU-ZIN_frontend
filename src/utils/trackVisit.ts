import { v4 as uuidv4 } from "uuid";

// 방문 기록 (관리자 대시보드 유입 분석용) - 브라우저마다 임의 번호로 하루 한 번만 보냄
//  IP·쿠키·회원 정보는 보내지 않음. 다른 사이트에서 왔을 때만 그 주소(서버가 도메인만 남김)
const ID_KEY = "muzin.visitorId";
const DAY_KEY = "muzin.visitDay";

const todayKst = () => new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    // 저장이 막힌 브라우저(시크릿 창 등)는 그냥 넘어감
  }
};

export function trackVisit() {
  const { pathname, search, origin } = window.location;
  if (pathname.startsWith("/admin") || pathname.startsWith("/oauth2")) return;

  const today = todayKst();
  if (read(DAY_KEY) === today) return;

  const existing = read(ID_KEY);
  const visitorId = existing ?? uuidv4();
  if (!existing) write(ID_KEY, visitorId);
  write(DAY_KEY, today);

  const ref = document.referrer;
  const external = ref && !ref.startsWith(origin) ? ref : null;
  const utmSource = new URLSearchParams(search).get("utm_source");

  fetch(`${import.meta.env.VITE_API_BASE_URL}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, referrer: external, landingPath: pathname, utmSource, returning: !!existing }),
    keepalive: true,
  }).catch(() => {
    // 기록 실패는 화면에 영향 없게
  });
}
