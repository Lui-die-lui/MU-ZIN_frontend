/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import * as s from "../../components/legal/styles";
import LegalDoc from "../../components/legal/LegalDoc";
import terms from "../../legal/terms.md?raw";
import privacy from "../../legal/privacy.md?raw";

const DOCS = {
  terms: { title: "이용약관", source: terms, other: { to: "/privacy", label: "개인정보 처리방침 보기" } },
  privacy: { title: "개인정보 처리방침", source: privacy, other: { to: "/terms", label: "이용약관 보기" } },
} as const;

// /terms, /privacy - 로그인 없이 볼 수 있음. 주소의 #article-5 같은 위치로 바로 이동
function LegalPage({ kind }: { kind: keyof typeof DOCS }) {
  const doc = DOCS[kind];
  const { hash } = useLocation();

  useEffect(() => {
    document.title = `${doc.title} - MU:ZIN`;
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else window.scrollTo(0, 0);
    return () => {
      document.title = "MU:ZIN";
    };
  }, [doc.title, hash]);

  return (
    <main css={s.page}>
      <header css={s.header}>
        <h1 css={s.title}>{doc.title}</h1>
        <Link to={doc.other.to} css={s.otherDoc}>
          {doc.other.label}
        </Link>
      </header>
      <article css={s.body}>
        <LegalDoc source={doc.source} />
      </article>
    </main>
  );
}

export default LegalPage;
