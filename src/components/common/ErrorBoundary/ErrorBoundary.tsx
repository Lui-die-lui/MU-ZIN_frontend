import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; resetKey?: string };
type State = { error: Error | null };

// 렌더링 중 예외가 나도 흰 화면 대신 안내 화면을 보여줌
// resetKey(현재 경로)가 바뀌면 다시 정상 렌더링 시도
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("렌더링 오류", error, info.componentStack);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{ padding: "64px 16px", textAlign: "center" }}>
        <h2 style={{ marginBottom: 8 }}>화면을 표시하는 중 문제가 발생했어요.</h2>
        <p style={{ color: "#666", marginBottom: 24 }}>
          잠시 후 다시 시도하거나, 문제가 계속되면 새로고침해주세요.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}
        >
          새로고침
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
