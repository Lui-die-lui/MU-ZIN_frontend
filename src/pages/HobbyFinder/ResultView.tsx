/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { CandidateView, StyleResult } from "../../features/hobbyFinder/types";

type Props = {
  result: StyleResult;
  viewId: string; // 지금 레슨을 보는 후보
  pairChoice: string | null; // 비슷한 두 후보 중 고른 것 (없으면 아직 안 물어봄)
  onChoosePair: (choice: string) => void; // 후보 id 또는 "both"
  onFindLessons: (candidateId: string) => void;
};

// 결과: 음악 스타일 해석 -> 대표 추천 1개(또는 비슷한 두 후보) -> 함께 살펴볼 후보
// 점수는 화면에 보여주지 않음 (검증된 적성 확률이 아님)
function ResultView({ result, viewId, pairChoice, onChoosePair, onFindLessons }: Props) {
  const pair = result.lead.length === 2 ? result.lead : null;

  return (
    <>
      <section css={s.resultHead} aria-labelledby="result-title">
        <span css={s.eyebrow}>내 음악 스타일</span>
        <h1 id="result-title" css={s.resultTitle}>
          {result.typeName}
        </h1>
        <p css={[s.resultDesc, { color: "#1b1d20", fontWeight: 700 }]}>{result.oneLiner}</p>
        <p css={s.resultDesc}>{result.interpretation.join(" ")}</p>
        {result.keywords.length > 0 && (
          <ul css={s.keywords} aria-label="내 음악 스타일 키워드">
            {result.keywords.map((k) => (
              <li key={k}>#{k}</li>
            ))}
          </ul>
        )}
        <p css={s.disclaimer}>답변을 바탕으로 정리한 참고용 결과예요. 적성 검사가 아니니, 끌리는 악기가 따로 있다면 그걸로 시작해도 좋아요.</p>
      </section>

      <h2 css={s.sectionTitle}>내 스타일에 어울리는 악기·보컬</h2>

      {pair ? (
        <>
          <p css={[s.cardText, { margin: "0 0 12px", color: "#4b5563" }]}>두 후보가 비슷하게 어울려요. 어느 쪽이 더 낫다고 정하지 않았어요.</p>
          <div css={s.pairGrid}>
            {pair.map((v) => (
              <CandidateCard key={v.candidate.id} view={v} label="비슷하게 어울려요" strong={false} active={v.candidate.id === viewId} onFindLessons={onFindLessons} />
            ))}
          </div>
          <div css={[s.choiceBox, { marginTop: 12 }]} aria-label="두 후보의 차이">
            {result.leadContrast && <p>{result.leadContrast}</p>}
            {pairChoice == null ? (
              <>
                <p css={{ color: "#4b5563" }}>
                  먼저 살펴보고 싶은 쪽이 있다면 골라 주세요. 골라도 추천 결과는 바뀌지 않고, 아래에서 먼저 볼 레슨만 정해요.
                </p>
                <div css={s.choiceRow} role="group" aria-label="먼저 살펴볼 후보 (선택 사항)">
                  {pair.map((v) => (
                    <button key={v.candidate.id} type="button" css={s.smallBtn} onClick={() => onChoosePair(v.candidate.id)}>
                      {v.candidate.name} 먼저 보기
                    </button>
                  ))}
                  <button type="button" css={s.smallBtn} onClick={() => onChoosePair("both")}>
                    둘 다 같이 볼게요
                  </button>
                </div>
              </>
            ) : (
              <p css={{ color: "#4b5563" }} role="status">
                {pairChoice === "both"
                  ? "두 후보를 같이 보고 있어요. 레슨은 아래에서 언제든 바꿔 볼 수 있어요."
                  : `${pair.find((v) => v.candidate.id === pairChoice)?.candidate.name ?? ""} 레슨부터 보고 있어요. 아래에서 언제든 바꿔 볼 수 있어요.`}
              </p>
            )}
          </div>
        </>
      ) : (
        <ul css={s.hobbyList}>
          <CandidateCard view={result.lead[0]} label="가장 잘 어울려요" strong active={result.lead[0].candidate.id === viewId} onFindLessons={onFindLessons} asItem />
        </ul>
      )}

      {result.notices.map((n) => (
        <p key={n} css={[s.note, { marginTop: 12 }]} role="note">
          {n}
        </p>
      ))}

      {result.others.length > 0 && (
        <>
          <h3 css={s.subTitle}>함께 살펴볼 후보</h3>
          <ul css={s.hobbyList}>
            {result.others.map((v) => (
              <CandidateCard key={v.candidate.id} view={v} active={v.candidate.id === viewId} onFindLessons={onFindLessons} asItem />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function CandidateCard({
  view,
  label,
  strong = false,
  active,
  onFindLessons,
  asItem = false,
}: {
  view: CandidateView;
  label?: string;
  strong?: boolean;
  active: boolean;
  onFindLessons: (id: string) => void;
  asItem?: boolean;
}) {
  const { candidate: c } = view;
  const Tag = asItem ? "li" : "article";
  return (
    <Tag css={s.hobbyCard(active)} aria-labelledby={`cand-${c.id}`}>
      {label && <span css={s.cardLabel(strong)}>{label}</span>}
      <div css={s.hobbyHead}>
        <h3 id={`cand-${c.id}`}>{c.name}</h3>
      </div>
      <p css={s.cardText}>{c.experience}</p>

      <div>
        <p css={s.blockLabel}>이런 답과 연결돼요</p>
        <ul css={s.bullet}>
          {view.linkedAnswers.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div>
        <p css={s.blockLabel}>시작해 본다면</p>
        <p css={s.cardText}>{view.start}</p>
      </div>

      <div css={s.tipBox}>
        <p css={s.blockLabel}>처음 배울 때 참고</p>
        <ul css={s.bullet}>
          {view.notes.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div css={s.hobbyActions}>
        <button type="button" css={s.btn(active ? "primary" : "ghost")} onClick={() => onFindLessons(c.id)} aria-pressed={active}>
          {c.name} 레슨 찾기
        </button>
      </div>
    </Tag>
  );
}

export default ResultView;
