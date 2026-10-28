import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { queryClient } from "./configs/queryClient";
import { BrowserRouter, useLocation } from "react-router-dom";
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
function RoutesWithBoundary() {
  const { pathname } = useLocation();
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
