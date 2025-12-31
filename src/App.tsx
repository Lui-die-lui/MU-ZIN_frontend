import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { queryClient } from "./configs/queryClient";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./routes/MainRouter";

function App() {
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
