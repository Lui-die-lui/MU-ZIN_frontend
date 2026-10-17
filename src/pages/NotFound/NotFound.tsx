import { Link } from "react-router-dom";

// 정의되지 않은 주소로 들어왔을 때 (예전엔 빈 화면)
function NotFound() {
  return (
    <div style={{ padding: "64px 16px", textAlign: "center" }}>
      <h2 style={{ marginBottom: 8 }}>페이지를 찾을 수 없어요</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>주소가 바뀌었거나 삭제된 페이지예요.</p>
      <Link to="/">홈으로 이동</Link>
    </div>
  );
}

export default NotFound;
