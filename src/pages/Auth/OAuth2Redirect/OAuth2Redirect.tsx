import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function OAuth2Redirect() {
  const query = useQuery();

  useEffect(() => {
    // 백엔드가 token이나 accesToken 중 뭘 주든 대응
    const token = query.get("accessToken") ?? query.get("token");
    const error = query.get("error") ?? query.get("error_description");
    const next = query.get("redirect") || "/";

    if (error) {
      console.error("OAuth2 error:", error);
      // 실패면 로그인 페이지로
      window.location.replace("/signin");
      return;
    }
    if (!token) {
      console.error("엑세스 가능한 토큰이 없습니다.");
      window.location.replace("/signin");
      return;
    }

    // accessToken 키로 저장
    const pure = token.startsWith("Bearer ") ? token.slice(7) : token;
    localStorage.setItem("accessToken", pure); // 키 밸류로 저장

    // 주소창 쿼리 제거
    window.history.replaceState({}, document.title, window.location.pathname);

    // redirect 값이 우리 사이트 내부 경로 일 때만 이동 - 아니면 홈으로 보냄
    // (악의적 파라미터 방지)
    const safeNext = next.startsWith("/") ? next : "/";

    // 제일 확실 : 새로고침 이동(헤더/principal 상태 갱신 확실하게)
    window.location.replace(safeNext);
  });
  return <div>로그인 처리중...</div>;
}

export default OAuth2Redirect;
