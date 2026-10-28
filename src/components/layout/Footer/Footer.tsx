/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import * as s from "./styles";
import { CONTACT_EMAIL } from "../../../legal/legal";

// 모든 화면 공용 하단 - 약관·처리방침·문의 + 중개 서비스 안내 (메뉴·소개는 상단 메뉴·메인에 있어서 넣지 않음)
function Footer() {
  const emailReady = !CONTACT_EMAIL.startsWith("[");

  return (
    <footer css={s.footer}>
      <div css={s.top}>
        <Link to="/" css={s.logo} aria-label="MU:ZIN 홈">
          MU<span aria-hidden="true">:</span>ZIN
        </Link>
        <nav css={s.links} aria-label="약관 및 문의">
          <Link to="/terms" css={s.link}>
            이용약관
          </Link>
          <Link to="/privacy" css={s.link}>
            <strong>개인정보 처리방침</strong>
          </Link>
          {emailReady ? (
            <a href={`mailto:${CONTACT_EMAIL}`} css={s.link}>
              문의 {CONTACT_EMAIL}
            </a>
          ) : (
            <span css={s.plain}>문의 {CONTACT_EMAIL}</span>
          )}
        </nav>
      </div>
      <div css={s.bottom}>
        <p css={s.notice}>MU:ZIN은 레슨 중개 서비스로, 레슨 약속과 결제의 당사자가 아닙니다.</p>
        <p css={s.copy}>© {new Date().getFullYear()} MU:ZIN</p>
      </div>
    </footer>
  );
}

export default Footer;
