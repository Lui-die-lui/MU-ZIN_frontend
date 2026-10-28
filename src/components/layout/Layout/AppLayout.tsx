/** @jsxImportSource @emotion/react */
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import * as s from "./styles";

// 화면 높이를 꽉 채우는 앱형 화면은 하단 푸터 없음 (AI 내비게이터: 입력창이 맨 아래)
const NO_FOOTER = ["/assistant", "/oauth2/redirect"];

function Layout() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <s.Wrap>
      <NavBar />
      <s.Main>
        <Outlet />
        {showFooter && <Footer />}
      </s.Main>
    </s.Wrap>
  );
}

export default Layout;
