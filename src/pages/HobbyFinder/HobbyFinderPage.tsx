/** @jsxImportSource @emotion/react */
import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as s from "./styles";
import QuizStep from "./QuizStep";
import ResultView from "./ResultView";
import LessonFinder from "./LessonFinder";
import ExploreInstruments from "./ExploreInstruments";
import { visibleQuestions } from "../../features/hobbyFinder/questions";
import { buildResult, firstUnanswered, isComplete } from "../../features/hobbyFinder/engine";
import { loadSaved, saveSaved, type HobbyFinderSaved, type StoredRegion } from "../../features/hobbyFinder/storage";
import { usePrincipalState } from "../../stores/usePrincipalState";
import { getMyArtistProfileReq } from "../../apis/artist/artistApi";

// 내 음악 스타일 찾기 (/hobby-finder) - 로그인 없이 시작 화면 · 질문 · 결과 · 선택 지역 레슨
// 주소: (없음) 시작 화면 / ?step=1~N 질문 / ?step=result 결과 -> 브라우저 뒤로 가기로 이전 질문, 새로고침해도 그대로
// 답변·지역은 이 브라우저에만 저장 (계정별로 따로)
function HobbyFinderPage() {
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  // 로그인/로그아웃하면 그 계정의 저장값으로 새로 시작
  return <HobbyFinder key={userId ?? "guest"} userId={userId} />;
}

function HobbyFinder({ userId }: { userId: number | null }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSavedState] = useState<HobbyFinderSaved>(() => loadSaved(userId));
  const lessonRef = useRef<HTMLElement>(null);

  const update = (patch: Partial<HobbyFinderSaved>) =>
    setSavedState((prev) => {
      const next = { ...prev, ...patch };
      saveSaved(userId, next);
      return next;
    });

  const questions = visibleQuestions(saved.answers);
  const complete = isComplete(saved.answers);
  const result = useMemo(() => (complete ? buildResult(saved.answers) : null), [complete, saved.answers]);

  // 로그인한 아티스트는 내 대표 지역을 처음 지역으로 (직접 바꿀 수 있음). 일반 회원은 저장된 지역이 없어 직접 선택
  const artistStatus = usePrincipalState((st) => st.principal?.artistStatus);
  const myRegionQ = useQuery({
    queryKey: ["hobbyFinder", "myArtistRegion", userId],
    queryFn: async () => (await getMyArtistProfileReq()).data.data?.mainRegion ?? null,
    enabled: !!userId && !!artistStatus && artistStatus !== "NONE" && !saved.region,
    retry: false,
    staleTime: Infinity,
  });
  const initialRegion: StoredRegion | null =
    saved.region ??
    (myRegionQ.data?.region1DepthName
      ? { region1DepthName: myRegionQ.data.region1DepthName, region2DepthName: myRegionQ.data.region2DepthName ?? null, region3DepthName: myRegionQ.data.region3DepthName ?? null }
      : null);

  // ---------- 지금 보여줄 화면 ----------
  const stepParam = params.get("step");
  const stepNum = Number(stepParam);
  const validStep = stepParam != null && Number.isInteger(stepNum) && stepNum >= 1 && stepNum <= questions.length;
  const firstOpen = firstUnanswered(saved.answers);
  const answeredAny = Object.keys(saved.answers).length > 0;
  let view: { kind: "intro" } | { kind: "quiz"; index: number } | { kind: "result" };
  if (stepParam === "result" && complete) view = { kind: "result" };
  else if (validStep && stepNum - 1 <= (firstOpen === -1 ? questions.length : firstOpen)) view = { kind: "quiz", index: stepNum - 1 };
  else if (stepParam == null && !answeredAny) view = { kind: "intro" };
  else if (complete && !validStep) view = { kind: "result" };
  else view = { kind: "quiz", index: Math.max(0, firstOpen) }; // 건너뛴 질문으로 바로 갈 수 없음

  // 앞으로 갈 때 어느 질문에서 왔는지 기록 -> "이전"은 그 경우 브라우저 뒤로 가기와 같게 (방문 기록이 꼬이지 않게)
  const goStep = (index: number, from?: number) => setParams({ step: String(index + 1) }, { state: from == null ? null : { from } });
  const goResult = (from: number) => setParams({ step: "result" }, { state: { from } });
  const goPrev = (index: number) => {
    const from = (location.state as { from?: number } | null)?.from;
    if (from === index - 1) navigate(-1);
    else setParams({ step: String(index) }, { replace: true });
  };

  const restart = () => {
    update({ answers: {}, viewId: null, pairChoice: null }); // 지역·수업 방식은 그대로 둠
    goStep(0);
    window.scrollTo({ top: 0 });
  };

  const scrollToLessons = () => requestAnimationFrame(() => lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  if (view.kind === "intro") {
    return (
      <main css={s.page}>
        <section css={s.resultHead} aria-labelledby="style-intro-title">
          <span css={s.eyebrow}>내 음악 스타일 찾기</span>
          <h1 id="style-intro-title" css={s.resultTitle}>
            음악을 직접 한다면, 어떤 순간이 즐거울까요?
          </h1>
          <p css={s.resultDesc}>
            몇 가지 질문으로 내 음악 스타일을 정리하고, 어울리는 악기·보컬과 선택 지역의 레슨까지 찾아봐요. 악기를 몰라도, 한 번도 해 본 적 없어도 괜찮아요.
          </p>
          <ul css={s.introList}>
            <li>질문 8~9개 · 약 2분</li>
            <li>로그인 없이</li>
            <li>정답 없음 · 가장 끌리는 하나만</li>
          </ul>
          {saved.resetFromOldVersion && (
            <p css={s.note} role="status">
              질문이 새로워져서 처음부터 다시 시작해요. 전에 고른 지역은 그대로 써요.
            </p>
          )}
          <div>
            <button type="button" css={s.btn("primary")} onClick={() => goStep(0)}>
              시작하기
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (view.kind === "result" && result) {
    const shown = [...result.lead, ...result.others].map((v) => v.candidate);
    const viewId =
      saved.viewId && (saved.viewId.startsWith("inst:") || shown.some((c) => c.id === saved.viewId)) ? saved.viewId : result.lead[0].candidate.id;
    const pairKey = result.lead.length === 2 ? result.lead.map((v) => v.candidate.id).join("|") : null;
    const pairChoice = pairKey && saved.pairChoice?.pair === pairKey ? saved.pairChoice.choice : null;

    return (
      <main css={s.page}>
        <ResultView
          result={result}
          viewId={viewId}
          pairChoice={pairChoice}
          onChoosePair={(choice) => {
            if (!pairKey) return;
            update({ pairChoice: { pair: pairKey, choice }, viewId: choice === "both" ? viewId : choice });
          }}
          onFindLessons={(id) => {
            update({ viewId: id });
            scrollToLessons();
          }}
        />
        <div css={{ height: 36 }} />
        {/* 아티스트 대표 지역을 불러오는 동안 기다렸다가 처음 지역으로 사용 */}
        {myRegionQ.isFetching ? (
          <div css={s.stateBox}>지역 정보를 불러오는 중...</div>
        ) : (
          <LessonFinder
            ref={lessonRef}
            candidates={shown}
            viewId={viewId}
            onSelect={(id) => update({ viewId: id })}
            region={initialRegion}
            onRegionChange={(r) => update({ region: r })}
            lessonTagNames={result.lessonTagNames}
            lessonMode={saved.lessonMode}
            onLessonModeChange={(m) => update({ lessonMode: m })}
          />
        )}
        <ExploreInstruments
          selectedViewId={viewId}
          onPick={(instId) => {
            update({ viewId: `inst:${instId}` });
            scrollToLessons();
          }}
        />
        <div css={s.restartRow}>
          <button type="button" css={s.btn("ghost")} onClick={restart}>
            ↺ 다시 해 보기
          </button>
        </div>
      </main>
    );
  }

  const index = view.kind === "quiz" ? view.index : 0;
  const q = questions[index];
  const isLast = index === questions.length - 1;

  return (
    <main css={s.page}>
      <QuizStep
        question={q}
        index={index}
        total={questions.length}
        selected={saved.answers[q.id]}
        isLast={isLast}
        onSelect={(optionId) => update({ answers: { ...saved.answers, [q.id]: optionId } })}
        onPrev={() => goPrev(index)}
        onNext={() => {
          if (!saved.answers[q.id]) return;
          // 답에 따라 뒤 질문(노래 후속)이 생기거나 없어질 수 있어 다음 질문 수를 다시 계산
          const nextQuestions = visibleQuestions(saved.answers);
          if (index >= nextQuestions.length - 1) goResult(index);
          else goStep(index + 1, index);
          window.scrollTo({ top: 0 });
        }}
      />
    </main>
  );
}

export default HobbyFinderPage;
