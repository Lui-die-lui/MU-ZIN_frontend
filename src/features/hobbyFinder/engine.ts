// 내 음악 스타일 찾기 - 계산 (화면과 분리된 순수 함수)
// 같은 답변 -> 항상 같은 결과: 무작위·시간 값을 쓰지 않고, 동점은 후보 목록 순서로 정함
//
// 1) 답변 -> 스타일 프로필 (역할·혼자/함께·나를 위해/들려주기·좋아하는 곡부터/차근차근·음색·음악·노래 활동)
// 2) 후보군: 기본 10개 + 국악(국악을 고른 경우) + 성악(가곡·아리아에 관심을 보인 경우)
// 3) 악기 적합도(0~1) = 역할·음색·음악·곡 만들기·노래 활동 (혼자/함께·속도는 넣지 않음)
// 4) 보여주기: 대표 1개 (2위와 CLOSE_GAP 이내면 "비슷한 두 후보"로 동등하게) + 고른 역할·활동과 이어지는 후보 (전체 최대 3개)
import { CANDIDATES } from "./candidates";
import { CLOSE_GAP, DEEP_LESSON_TAGS, FIT_DECIMALS, FIT_WEIGHTS, MAX_SHOWN, QUIZ_VERSION } from "./config";
import {
  CREATE_ANSWER,
  CREATE_SENTENCE,
  GENRE_NAME,
  josa,
  NO_LINK_ANSWER,
  NOTICE_KOREAN_VOICE,
  OUTLET_SENTENCE,
  PRACTICE_STUDIO,
  ROLE_ANSWER,
  ROLE_EXPERIENCE,
  ROLE_KEYWORD,
  ROLE_NAME,
  START_SHARE,
  START_TEMPLATE,
  TIMBRE_KEYWORD,
  TIMBRE_NAME,
  TYPE_COPY,
  VOICE_ANSWER,
  VOICE_AS_MELODY_ANSWER,
  VOICE_AS_MELODY_SENTENCE,
} from "./copy";
import { visibleQuestions } from "./questions";
import type { Answers, Candidate, CandidateView, Role, ScoredCandidate, StyleProfile, StyleResult, TypeKey } from "./types";

const ROLES: Role[] = ["melody", "rhythm", "voice", "harmony"];

// 보이는 질문에 모두 정해진 선택지로 답했는지
export const isComplete = (answers: Answers) =>
  visibleQuestions(answers).every((q) => q.options.some((o) => o.id === answers[q.id]));

// 보이는 질문 중 첫 번째 안 한 질문 (없으면 -1)
export const firstUnanswered = (answers: Answers) =>
  visibleQuestions(answers).findIndex((q) => !q.options.some((o) => o.id === answers[q.id]));

// 1) 프로필 - 지금 보이는 질문의 답만 사용 (조건이 사라진 후속 질문의 예전 답은 무시)
export function buildProfile(answers: Answers): StyleProfile {
  const p: StyleProfile = { roles: [], social: 0, outlet: 0, pace: 0, create: false, timbre: null, genre: null, voice: null, practice: null };
  for (const q of visibleQuestions(answers)) {
    const e = q.options.find((o) => o.id === answers[q.id])?.effect;
    if (!e) continue;
    if (e.role) p.roles.push(e.role);
    p.social += e.social ?? 0;
    p.outlet += e.outlet ?? 0;
    p.pace += e.pace ?? 0;
    if (e.create) p.create = true;
    if (e.timbre) p.timbre = e.timbre;
    if (e.genre) p.genre = e.genre;
    if (e.voice) p.voice = e.voice;
    if (e.practice) p.practice = e.practice;
  }
  return p;
}

// 두 문항(Q3·Q5 / Q4·Q5)이 같은 쪽일 때만 그쪽으로 판정, 엇갈리면 mixed
export function typeKeyOf(p: StyleProfile): TypeKey {
  const social = p.social >= 2 ? "together" : p.social <= -2 ? "solo" : "mixed";
  const pace = p.pace >= 3 ? "deep" : p.pace <= -3 ? "quick" : "mixed";
  return `${social}|${pace}` as TypeKey;
}

// 노래보다 악기에 관심이 있다고 하면 목소리 역할은 "노래하듯 이어지는 선율"로 봄
const matchRoles = (p: StyleProfile): Role[] => (p.voice === "none" ? p.roles.map((r) => (r === "voice" ? "melody" : r)) : p.roles);

// 2) 후보군
export const candidatePool = (p: StyleProfile) =>
  CANDIDATES.filter(
    (c) =>
      ((c.group === "base" && !(p.voice === "none" && c.id === "vocal")) ||
        (c.group === "korean" && p.genre === "korean") ||
        (c.group === "seongak" && (p.voice === "classical" || p.voice === "both"))),
  );

const activityMatch = (p: StyleProfile, c: Candidate) =>
  (c.id === "vocal" && (p.voice === "pop" || p.voice === "both")) || (c.id === "seongak" && (p.voice === "classical" || p.voice === "both"));

function roleCosine(p: StyleProfile, c: Candidate) {
  let dot = 0, nu = 0, nc = 0;
  const roles = matchRoles(p);
  for (const r of ROLES) {
    const u = roles.filter((x) => x === r).length;
    const v = c.role[r] ?? 0;
    dot += u * v;
    nu += u * u;
    nc += v * v;
  }
  return nu && nc ? dot / Math.sqrt(nu * nc) : 0;
}

// 3) 악기 적합도: 쓰인 항목만 가중 평균 -> 항상 0~1 (보너스로 1을 넘지 않음)
export function fitOf(p: StyleProfile, c: Candidate): number {
  const parts: [number, number][] = [
    [FIT_WEIGHTS.role, roleCosine(p, c)],
    [FIT_WEIGHTS.timbre, p.timbre ? c.timbre[p.timbre] ?? 0 : 0],
  ];
  if (p.genre) parts.push([FIT_WEIGHTS.genre, c.genre[p.genre] ?? 0]);
  if (p.create) parts.push([FIT_WEIGHTS.create, c.compose ? 1 : 0]);
  if (p.voice && p.voice !== "none") parts.push([FIT_WEIGHTS.activity, activityMatch(p, c) ? 1 : 0]);
  const wsum = parts.reduce((s, [w]) => s + w, 0);
  const fit = parts.reduce((s, [w, v]) => s + w * v, 0) / wsum;
  const k = 10 ** FIT_DECIMALS;
  return Math.round(fit * k) / k;
}

export function rankCandidates(p: StyleProfile): ScoredCandidate[] {
  return candidatePool(p)
    .map((candidate) => ({
      candidate,
      order: CANDIDATES.indexOf(candidate),
      fit: fitOf(p, candidate),
      roleLinked: matchRoles(p).some((r) => (candidate.role[r] ?? 0) >= 1),
      activityLinked: activityMatch(p, candidate),
    }))
    .sort((a, b) => b.fit - a.fit || a.order - b.order);
}

// 4) 보여줄 후보 고르기
// - 대표: 1위. 2위와 CLOSE_GAP 이내면 두 후보를 동등하게
// - 함께 살펴볼 후보: 고른 역할을 주로 맡거나 고른 노래 활동과 맞는 후보만 (개수를 채우려고 넣지 않음)
// - 역할 답이 갈렸으면(멜로디 + 박자 등) 각 역할을 주로 맡는 후보가 하나씩은 보이게 먼저 넣음
export function pickShown(ranked: ScoredCandidate[], roles: Role[] = []) {
  const [top, second] = ranked;
  const close = !!second && top.fit - second.fit <= CLOSE_GAP + 1e-9;
  const lead = close ? [top, second] : [top];
  const room = MAX_SHOWN - lead.length;
  const others: ScoredCandidate[] = [];
  const covers = (r: ScoredCandidate, role: Role) => (r.candidate.role[role] ?? 0) >= 1;
  for (const role of [...new Set(roles)]) {
    if ([...lead, ...others].some((r) => covers(r, role)) || others.length >= room) continue;
    const best = ranked.find((r) => !lead.includes(r) && !others.includes(r) && covers(r, role));
    if (best) others.push(best);
  }
  for (const r of ranked) {
    if (others.length >= room) break;
    if (!lead.includes(r) && !others.includes(r) && (r.roleLinked || r.activityLinked)) others.push(r);
  }
  others.sort((a, b) => b.fit - a.fit || a.order - b.order);
  return { lead, others };
}

// ---------- 문구 ----------
function linkedAnswers(p: StyleProfile, c: Candidate): string[] {
  const out: string[] = [];
  for (const r of ROLES) if (p.roles.includes(r) && (c.role[r] ?? 0) >= 1) out.push(ROLE_ANSWER[r]);
  if (p.voice === "none" && p.roles.includes("voice") && (c.role.melody ?? 0) >= 1) out.push(VOICE_AS_MELODY_ANSWER);
  if (p.timbre && (c.timbre[p.timbre] ?? 0) >= 0.7) out.push(`${TIMBRE_NAME[p.timbre]}를 좋아한다는 답`);
  if (p.genre && (c.genre[p.genre] ?? 0) >= 0.5) out.push(`${GENRE_NAME[p.genre]} 쪽 음악을 해 보고 싶다는 답`);
  if (c.id === "vocal" && (p.voice === "pop" || p.voice === "both")) out.push(VOICE_ANSWER.pop);
  if (c.id === "seongak" && (p.voice === "classical" || p.voice === "both")) out.push(VOICE_ANSWER.classical);
  if (p.create && c.compose) out.push(CREATE_ANSWER);
  return out.length ? out : [NO_LINK_ANSWER];
}

function viewOf(p: StyleProfile, typeKey: TypeKey, c: Candidate): CandidateView {
  const start = [START_TEMPLATE[typeKey].replace("{basics}", c.basics).replace("{verb}", c.verb)];
  const genreNote = p.genre ? c.genreNotes?.[p.genre] : undefined;
  if (genreNote) start.push(genreNote);
  if (p.outlet > 0) start.push(START_SHARE);
  const notes = [c.entry];
  const practice = p.practice === "studio" ? PRACTICE_STUDIO : p.practice ? c.practice[p.practice] : undefined;
  if (practice) notes.push(practice);
  return { candidate: c, linkedAnswers: linkedAnswers(p, c), start: start.join(" "), notes };
}

function interpretationOf(p: StyleProfile, typeKey: TypeKey): string[] {
  const [social] = typeKey.split("|");
  const lines = [TYPE_COPY[typeKey].sentence, OUTLET_SENTENCE[`${social as "solo" | "together" | "mixed"}|${p.outlet > 0 ? "out" : "in"}`]];
  const roles = ROLES.filter((r) => p.roles.includes(r)); // 표시 순서 고정 (멜로디·박자·노래·반주)
  const timbre = p.timbre ? TIMBRE_NAME[p.timbre] : null;
  if (p.voice === "none" && roles.includes("voice")) {
    lines.push(VOICE_AS_MELODY_SENTENCE);
  } else if (roles.length === 1) {
    lines.push(`${ROLE_NAME[roles[0]]}에 먼저 귀가 가고${timbre ? ` ${timbre}에 끌린다면` : "다면"}, ${ROLE_EXPERIENCE[roles[0]]}이 잘 맞을 수 있어요.`);
  } else if (roles.length === 2) {
    lines.push(
      `${josa(ROLE_NAME[roles[0]], "과", "와")} ${ROLE_NAME[roles[1]]} 양쪽에 귀가 가${timbre ? `고 ${timbre}에 끌리` : ""}는 편이라, 한 가지 역할로 단정하기보다 두 방향의 후보를 함께 살펴보는 게 좋아요.`,
    );
  }
  if (p.create) lines.push(CREATE_SENTENCE);
  return lines;
}

function keywordsOf(p: StyleProfile, typeKey: TypeKey): string[] {
  const list = [...TYPE_COPY[typeKey].keywords, ...[...new Set(p.roles)].map((r) => ROLE_KEYWORD[r])];
  if (p.timbre) list.push(TIMBRE_KEYWORD[p.timbre]);
  return [...new Set(list)].slice(0, 4);
}

export function buildResult(answers: Answers): StyleResult {
  const p = buildProfile(answers);
  const typeKey = typeKeyOf(p);
  const ranked = rankCandidates(p);
  const { lead, others } = pickShown(ranked, matchRoles(p));
  const leadContrast =
    lead.length === 2
      ? `${josa(lead[0].candidate.name, "은", "는")} ${lead[0].candidate.contrast}이고, ${josa(lead[1].candidate.name, "은", "는")} ${lead[1].candidate.contrast}이에요.`
      : null;
  const notices = p.genre === "korean" && p.roles.includes("voice") ? [NOTICE_KOREAN_VOICE] : [];
  return {
    version: QUIZ_VERSION,
    typeKey,
    typeName: TYPE_COPY[typeKey].name,
    oneLiner: TYPE_COPY[typeKey].oneLiner,
    interpretation: interpretationOf(p, typeKey),
    keywords: keywordsOf(p, typeKey),
    lead: lead.map((r) => viewOf(p, typeKey, r.candidate)),
    leadContrast,
    others: others.map((r) => viewOf(p, typeKey, r.candidate)),
    notices,
    lessonTagNames: typeKey.endsWith("|deep") ? DEEP_LESSON_TAGS : [],
    ranked,
  };
}

// ---------- 향후 AI 검색 챗봇 연동용 (이번 작업에서는 만들기만 하고 호출하지 않음) ----------
export type StyleAssistantContext = {
  schema: "muzin.style-finder.context/v2";
  quizVersion: string;
  styleType: TypeKey;
  styleKeywords: string[];
  recommended: { id: string; name: string; instrumentNames: string[] }[];
  preferences: { roles: Role[]; social: string; pace: string; timbre: string | null; music: string | null; voice: string | null };
  region: { region1DepthName: string; region2DepthName: string | null; region3DepthName: string | null } | null;
};

export function toAssistantContext(answers: Answers, region: StyleAssistantContext["region"]): StyleAssistantContext {
  const p = buildProfile(answers);
  const r = buildResult(answers);
  const [social, pace] = r.typeKey.split("|");
  return {
    schema: "muzin.style-finder.context/v2",
    quizVersion: r.version,
    styleType: r.typeKey,
    styleKeywords: r.keywords,
    recommended: [...r.lead, ...r.others].map(({ candidate: c }) => ({ id: c.id, name: c.name, instrumentNames: c.instrumentNames })),
    preferences: { roles: [...new Set(p.roles)], social, pace, timbre: p.timbre, music: p.genre, voice: p.voice },
    region,
  };
}
