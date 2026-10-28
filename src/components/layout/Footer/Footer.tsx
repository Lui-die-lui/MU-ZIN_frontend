/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import * as s from "./styles";

// 공개 화면 공용 하단. 메뉴·소개는 상단 메뉴·메인에 이미 있어서 다른 곳에 없는 안내만 둠
// (사업자 정보·약관은 실제로 생기면 추가)
function Footer() {
  return (
    <footer css={s.footer}>
      <Link to="/" css={s.logo} aria-label="MU:ZIN 홈">
        MU<span aria-hidden="true">:</span>ZIN
      </Link>
      <p css={s.notice}>
        레슨 정보와 예약 요청을 이어 주는 개인 프로젝트예요. 결제·정산 기능은 없고, 레슨비는 수강생과 아티스트가 직접 주고받아요.
      </p>
      <p css={s.copy}>© {new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;
