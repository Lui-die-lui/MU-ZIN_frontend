import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { queryClient } from "./configs/queryClient";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./routes/MainRouter";
import { usePrincipalState } from "./stores/usePrincipalState";
import { useEffect } from "react";

function App() {

  // 시작 시 principal 상태 자동으로 1회 받아옴
  useEffect(() => {
    usePrincipalState.getState().bootstrap();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MainRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
