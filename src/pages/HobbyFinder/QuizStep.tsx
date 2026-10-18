/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import * as s from "./styles";
import type { QuizQuestion } from "../../features/hobbyFinder/types";

type Props = {
  question: QuizQuestion;
  index: number; // 0부터
  total: number;
  selected: string | undefined;
  onSelect: (optionId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
};

// 한 화면에 질문 하나
// 키보드: ↑↓(←→)로 선택 이동, 숫자 1~5 바로 선택, Enter 다음 / 터치: 큰 선택 카드
function QuizStep({ question, index, total, selected, onSelect, onPrev, onNext, isLast }: Props) {
  const groupRef = useRef<HTMLDivElement>(null);
  const reality = question.kind === "reality";

  // 질문이 바뀌면 선택된 답(없으면 첫 답)으로 초점
  useEffect(() => {
    const target =
      groupRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]') ??
      groupRef.current?.querySelector<HTMLButtonElement>('[role="radio"]');
    target?.focus({ preventScroll: true });
  }, [question.id]);

  const move = (delta: number) => {
    const idx = question.options.findIndex((o) => o.id === selected);
    const next = question.options[(idx + delta + question.options.length) % question.options.length];
    onSelect(next.id);
    requestAnimationFrame(() => groupRef.current?.querySelector<HTMLButtonElement>(`[data-option="${next.id}"]`)?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") move(selected ? 1 : 0);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(selected ? -1 : 0);
    else if (/^[1-9]$/.test(e.key) && question.options[Number(e.key) - 1]) onSelect(question.options[Number(e.key) - 1].id);
    else if (e.key === "Enter" && selected) onNext();
    else return;
    e.preventDefault();
  };

  return (
    <section aria-labelledby="quiz-question">
      <div css={s.progressRow}>
        <span>
          <strong>
            {index + 1} / {total}
          </strong>
        </span>
        <span>
          {reality
            ? "마지막으로 연습 환경을 알려주세요"
            : question.kind === "followup"
              ? "노래에 끌린다고 해서 하나만 더 물어볼게요"
              : "정답은 없어요, 가장 끌리는 하나를 골라주세요"}
        </span>
      </div>
      <div
        css={s.progressBar}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label="질문 진행"
      >
        <div css={s.progressFill(((index + 1) / total) * 100)} />
      </div>

      <span css={s.sectionBadge(reality)}>
        {reality ? "연습 환경 · 추천에는 반영되지 않고 시작 방법 안내에만 써요" : question.kind === "followup" ? "노래" : "취향"}
      </span>
      <h1 id="quiz-question" css={s.question}>
        {question.title}
      </h1>
      <p css={s.questionHint}>
        {question.hint ? `${question.hint} ` : ""}숫자 키나 방향키로도 고를 수 있어요.
      </p>

      <div ref={groupRef} css={s.options} role="radiogroup" aria-labelledby="quiz-question" onKeyDown={onKeyDown}>
        {question.options.map((o, i) => {
          const on = o.id === selected;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              data-option={o.id}
              // 선택된 답(없으면 첫 답)만 Tab 으로 들어감
              tabIndex={on || (!selected && i === 0) ? 0 : -1}
              css={s.option(on)}
              onClick={() => onSelect(o.id)}
            >
              <span css={s.optionKey(on)} aria-hidden="true">
                {i + 1}
              </span>
              {o.label}
            </button>
          );
        })}
      </div>

      <div css={s.navRow}>
        <button type="button" css={s.btn("ghost")} onClick={onPrev} disabled={index === 0}>
          ← 이전
        </button>
        <button type="button" css={s.btn("primary", true)} onClick={onNext} disabled={!selected}>
          {isLast ? "결과 보기" : "다음 →"}
        </button>
      </div>
    </section>
  );
}

export default QuizStep;
