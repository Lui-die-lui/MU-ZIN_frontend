import { Alert, Snackbar } from "@mui/material";
import { useToastStore } from "../../../stores/useToastStore";

// 앱 전체에서 하나만 렌더링되는 알림 스낵바
function GlobalToast() {
  const current = useToastStore((s) => s.current);
  const close = useToastStore((s) => s.close);

  return (
    <Snackbar
      key={current?.id}
      open={!!current}
      autoHideDuration={current?.severity === "error" ? 5000 : 3000}
      onClose={(_e, reason) => {
        if (reason === "clickaway") return;
        close();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={close}
        severity={current?.severity ?? "info"}
        variant="filled"
        // 브랜드 톤: 성공·안내·주의는 검정, 오류만 짙은 빨강 (MUI 기본 초록/파랑/주황 대신)
        sx={{
          width: "100%",
          whiteSpace: "pre-line",
          fontFamily: "inherit",
          borderRadius: "10px",
          bgcolor: current?.severity === "error" ? "#b42318" : "#111827",
          color: "#fff",
          "& .MuiAlert-icon, & .MuiAlert-action": { color: "#fff" },
        }}
      >
        {current?.message}
      </Alert>
    </Snackbar>
  );
}

export default GlobalToast;
