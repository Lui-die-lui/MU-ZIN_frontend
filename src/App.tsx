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

// 경로가 바뀌면 에러 화면을 초기화할 수 있게 경로를 resetKey로 넘김
function RoutesWithBoundary() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary resetKey={pathname}>
      <MainRouter />
    </ErrorBoundary>
  );
}

function App() {

  // 시작 시 principal 상태 자동으로 1회 받아옴
  useEffect(() => {
    usePrincipalState.getState().bootstrap();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionWatcher />
        <RoutesWithBoundary />
      </BrowserRouter>
      <GlobalToast />
    </QueryClientProvider>
  );
}

export default App;
