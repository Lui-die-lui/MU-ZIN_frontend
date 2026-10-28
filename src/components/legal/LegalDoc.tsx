/** @jsxImportSource @emotion/react */
import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import * as s from "./styles";

/*
 * 약관·처리방침 마크다운을 화면으로 (src/legal/*.md)
 *  지원: ## 제목 {#id}, 문단, 1. 번호 목록 + 들여쓴 - 하위 목록, - 목록, **굵게**, [글자](#id 또는 /경로), 표, ---
 *  "## 제5조 (...)" 는 id="article-5" 로 (가입 화면에서 바로 이동)
 *  외부 주소는 링크로 만들지 않음 (문서가 바뀌어도 바깥으로 보내는 링크가 생기지 않게)
 */

function inline(text: string, key = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:#|\/)[^)\s]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] != null) out.push(<strong key={`${key}-b${i++}`}>{inline(m[1], key + 1)}</strong>);
    else {
      const href = m[3];
      out.push(
        href.startsWith("#") ? (
          <a key={`${key}-a${i++}`} href={href} css={s.link}>
            {m[2]}
          </a>
        ) : (
          <Link key={`${key}-l${i++}`} to={href} css={s.link}>
            {m[2]}
          </Link>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const headingId = (text: string, explicit?: string) => {
  if (explicit) return explicit;
  const art = text.match(/^제(\d+)조/);
  return art ? `article-${art[1]}` : undefined;
};

type ListItem = { text: string; children: string[] };

function LegalDoc({ source }: { source: string }) {
  const lines = source.replace(/<!--[\s\S]*?-->/g, "").split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const h = line.match(/^(#{1,3})\s+(.+?)(?:\s+\{#([\w-]+)\})?\s*$/);
    if (h) {
      const text = h[2];
      const id = headingId(text, h[3]);
      blocks.push(
        h[1].length <= 2 ? (
          <h2 key={k++} id={id} css={s.h2}>
            {inline(text)}
          </h2>
        ) : (
          <h3 key={k++} id={id} css={s.h3}>
            {inline(text)}
          </h3>
        ),
      );
      i++;
      continue;
    }

    if (line.trim() === "---") {
      blocks.push(<hr key={k++} css={s.hr} />);
      i++;
      continue;
    }

    if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{3,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={k++} css={s.tableWrap}>
          <table css={s.table}>
            <thead>
              <tr>
                {head.map((c, j) => (
                  <th key={j} scope="col">
                    {inline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, j) => (
                    <td key={j}>{inline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const ordered = /^\d+\.\s+/.test(line);
    if (ordered || /^-\s+/.test(line)) {
      const items: ListItem[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (ordered ? /^\d+\.\s+/.test(l) : /^-\s+/.test(l)) {
          items.push({ text: l.replace(/^(\d+\.|-)\s+/, ""), children: [] });
        } else if (/^\s{2,}-\s+/.test(l) && items.length) {
          items[items.length - 1].children.push(l.replace(/^\s+-\s+/, ""));
        } else break;
        i++;
      }
      const Tag = ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={k++} css={s.list}>
          {items.map((it, j) => (
            <li key={j}>
              {inline(it.text)}
              {it.children.length > 0 && (
                <ul css={s.subList}>
                  {it.children.map((c, ci) => (
                    <li key={ci}>{inline(c)}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </Tag>,
      );
      continue;
    }

    // 문단: 빈 줄 전까지 (줄바꿈 유지)
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|\||\d+\.\s|-\s|---$)/.test(lines[i].trim())) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={k++} css={s.p}>
        {para.map((t, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {inline(t)}
          </Fragment>
        ))}
      </p>,
    );
  }

  return <div css={s.doc}>{blocks}</div>;
}

export default LegalDoc;
