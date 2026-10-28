import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { queryClient } from "./configs/queryClient";
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import MainRouter from "./routes/MainRouter";
import { usePrincipalState } from "./stores/usePrincipalState";
import { useEffect } from "react";
import GlobalToast from "./components/common/GlobalToast/GlobalToast";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import SessionWatcher from "./components/auth/SessionWatcher";
import ChatRealtime from "./realtime/ChatRealtime";
import { trackVisit } from "./utils/trackVisit";
import { syncPushForUser } from "./push/pushClient";

// 경로가 바뀌면 에러 화면을 초기화할 수 있게 경로를 resetKey로 넘김
// 약관에 동의하지 않은 회원(약관이 바뀜 / 동의 기능 이전 가입)은 동의 화면으로. 약관·처리방침은 읽을 수 있게 둠
const CONSENT_FREE = ["/consent", "/terms", "/privacy", "/oauth2/redirect"];

function RoutesWithBoundary() {
  const loc = useLocation();
  const { pathname } = loc;
  const consentRequired = usePrincipalState((s) => !!s.principal?.consentRequired);
  if (consentRequired && !CONSENT_FREE.includes(pathname)) {
    return <Navigate to="/consent" replace state={{ from: loc }} />;
  }
  return (
    <ErrorBoundary resetKey={pathname}>
      <MainRouter />
    </ErrorBoundary>
  );
}

// 로그인한 계정이 바뀌면(로그인·새로고침·계정 전환) 이 기기의 알림 구독을 그 계정에 맞춤
function PushSync() {
  const userId = usePrincipalState((s) => s.principal?.userId ?? null);
  useEffect(() => {
    if (userId != null) void syncPushForUser(userId);
  }, [userId]);
  return null;
}

function App() {

  // 시작 시 principal 상태 자동으로 1회 받아옴
  useEffect(() => {
    usePrincipalState.getState().bootstrap();
    trackVisit();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionWatcher />
        <ChatRealtime />
        <PushSync />
        <RoutesWithBoundary />
      </BrowserRouter>
      <GlobalToast />
    </QueryClientProvider>
  );
}

export default App;
