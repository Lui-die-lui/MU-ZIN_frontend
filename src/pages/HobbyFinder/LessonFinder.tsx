/** @jsxImportSource @emotion/react */
import { forwardRef, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as s from "./styles";
import RegionSearchInput from "../Artist/ArtistSearch/RegionSearchInput/RegionSearchInput";
import LessonDetailDrawer from "../Lesson/LessonDetailDrawer/LessonDetailDrawer";
import ProfileAvatar from "../../components/common/ProfileAvatar/ProfileAvatar";
import { getInstrumentsReq } from "../../apis/instrument/instrumentApis";
import { getLessonStyleTags } from "../../apis/lesson/lessonApis";
import { getRecommendedLessonsReq, type RecommendedLesson } from "../../apis/lesson/recommendApi";
import { LESSON_MODE_LABEL, type LessonMode } from "../../Types/lessonTypes";
import type { RegionSearchValue } from "../../Types/artistRegionTypes";
import type { Candidate } from "../../features/hobbyFinder/types";
import type { LessonModeChoice, StoredRegion } from "../../features/hobbyFinder/storage";
import { normalizeRegion1DepthName } from "../../utils/regionUtils";
import { getErrorMessage } from "../../utils/errorUtils";

type Props = {
  candidates: Candidate[]; // 결과에 보인 추천 후보
  viewId: string; // 후보 id 또는 "inst:<악기 id>" (다른 악기 둘러보기에서 고른 경우)
  onSelect: (viewId: string) => void;
  region: StoredRegion | null;
  onRegionChange: (r: StoredRegion) => void;
  lessonTagNames: string[]; // 학습 방식과 의미가 직접 맞는 레슨 태그 (없으면 태그로 정렬하지 않음)
  lessonMode: LessonModeChoice;
  onLessonModeChange: (m: LessonModeChoice) => void;
};

const regionText = (r: { region1DepthName: string | null; region2DepthName?: string | null; region3DepthName?: string | null } | null) =>
  r ? [r.region1DepthName, r.region2DepthName, r.region3DepthName].filter(Boolean).join(" ") : "";

const priceText = (p: number | null) => (p == null ? "가격 문의" : p === 0 ? "무료" : `${p.toLocaleString("ko-KR")}원`);

const MODE_CHOICES: { id: LessonModeChoice; label: string; modes: LessonMode[] }[] = [
  { id: "any", label: "상관없어요", modes: [] },
  { id: "inperson", label: "직접 만나서", modes: ["OFFLINE", "VISIT"] },
  { id: "online", label: "온라인", modes: ["ONLINE"] },
];

// 선택 지역의 실제 레슨 (필수: 악기 + 지역 / 정렬만: 학습 방식과 맞는 레슨 태그 · 원하는 수업 방식)
const LessonFinder = forwardRef<HTMLElement, Props>(function LessonFinder(
  { candidates, viewId, onSelect, region, onRegionChange, lessonTagNames, lessonMode, onLessonModeChange },
  ref,
) {
  const [draft, setDraft] = useState<RegionSearchValue>({
    region1DepthName: region?.region1DepthName ?? "",
    region2DepthName: region?.region2DepthName ?? null,
    region3DepthName: region?.region3DepthName ?? null,
  });
  const [regionError, setRegionError] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<number | null>(null);

  // 후보 -> 기존 악기 id, 학습 방식 -> 기존 레슨 스타일 태그 id (이름으로 연결)
  const instrumentsQ = useQuery({ queryKey: ["instruments", "all"], queryFn: async () => (await getInstrumentsReq()).data, staleTime: 30 * 60_000 });
  const tagsQ = useQuery({ queryKey: ["lessonStyleTags"], queryFn: getLessonStyleTags, staleTime: 30 * 60_000 });

  // 지금 볼 대상 (추천 후보 또는 둘러보기에서 고른 악기)
  const target = useMemo(() => {
    const all = instrumentsQ.data ?? [];
    if (viewId.startsWith("inst:")) {
      const inst = all.find((i) => `inst:${i.instId}` === viewId);
      return { id: viewId, name: inst?.instName ?? "고른 악기", instIds: inst ? [inst.instId] : [], picked: true };
    }
    const c = candidates.find((x) => x.id === viewId) ?? candidates[0];
    const instIds = all.filter((i) => c.instrumentNames.includes(i.instName)).map((i) => i.instId).sort((a, b) => a - b);
    return { id: c.id, name: c.name, instIds, picked: false };
  }, [viewId, candidates, instrumentsQ.data]);

  const preferTagIds = useMemo(
    () => (tagsQ.data ?? []).filter((t) => lessonTagNames.includes(t.styleName)).map((t) => t.lessonStyleTagId).sort((a, b) => a - b),
    [tagsQ.data, lessonTagNames],
  );
  const preferModes = MODE_CHOICES.find((m) => m.id === lessonMode)?.modes ?? [];

  const lessonsQ = useQuery({
    queryKey: ["hobbyLessons", target.instIds, region, preferTagIds, preferModes],
    queryFn: () =>
      getRecommendedLessonsReq({
        instIds: target.instIds,
        region1DepthName: region!.region1DepthName,
        region2DepthName: region!.region2DepthName ?? undefined,
        region3DepthName: region!.region3DepthName ?? undefined,
        preferTagIds,
        preferModes,
        size: 12,
      }),
    enabled: !!region && target.instIds.length > 0 && tagsQ.isSuccess,
  });

  const apply = () => {
    const r1 = normalizeRegion1DepthName(draft.region1DepthName).trim();
    if (!r1) {
      setRegionError("시·도를 먼저 골라주세요.");
      return;
    }
    setRegionError(null);
    onRegionChange({ region1DepthName: r1, region2DepthName: draft.region2DepthName?.trim() || null, region3DepthName: draft.region2DepthName ? draft.region3DepthName?.trim() || null : null });
  };

  const focusRegion = () => document.getElementById("hobby-region")?.scrollIntoView({ behavior: "smooth", block: "center" });

  const lessons = lessonsQ.data ?? [];
  const others = candidates.filter((c) => c.id !== target.id);
  const sortParts = [
    ...(preferTagIds.length ? [`강사가 등록한 레슨 특징 중 '${lessonTagNames.join("·")}'과 겹치는 레슨`] : []),
    ...(preferModes.length ? ["원하는 수업 방식의 레슨"] : []),
  ];

  return (
    <section ref={ref} id="hobby-lessons" css={s.lessonPanel} aria-labelledby="hobby-lessons-title">
      <h2 id="hobby-lessons-title" css={[s.sectionTitle, { margin: 0 }]}>
        선택 지역의 레슨
      </h2>

      <div css={s.hobbyTabs} role="group" aria-label="레슨을 볼 악기·보컬">
        {candidates.map((c) => (
          <button key={c.id} type="button" css={s.hobbyTab(c.id === target.id)} aria-pressed={c.id === target.id} onClick={() => onSelect(c.id)}>
            {c.name}
          </button>
        ))}
        {target.picked && (
          <button type="button" css={s.hobbyTab(true)} aria-pressed>
            {target.name}
          </button>
        )}
      </div>

      <div id="hobby-region" css={s.regionRow}>
        <RegionSearchInput value={draft} onChange={setDraft} />
        <div css={s.regionApplied}>
          <span>{region ? <>지금 보는 지역: <strong>{regionText(region)}</strong></> : "레슨을 찾을 지역을 골라주세요. (위치 권한은 필요 없어요)"}</span>
          <button type="button" css={s.btn("primary")} onClick={apply}>
            이 지역으로 보기
          </button>
        </div>
        {regionError && (
          <p role="alert" css={[s.note, { color: "#b42318" }]}>
            {regionError}
          </p>
        )}
      </div>

      <div css={s.hobbyTabs} role="group" aria-label="원하는 수업 방식 (먼저 보여줘요)">
        <span css={{ alignSelf: "center", fontSize: 13, color: "#6b7280", marginRight: 4 }}>수업 방식</span>
        {MODE_CHOICES.map((m) => (
          <button key={m.id} type="button" css={s.hobbyTab(m.id === lessonMode)} aria-pressed={m.id === lessonMode} onClick={() => onLessonModeChange(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {!region ? null : instrumentsQ.isError || tagsQ.isError ? (
        <div css={s.stateBox}>
          <strong>레슨 정보를 불러오지 못했어요.</strong>
          <button type="button" css={s.smallBtn} onClick={() => { instrumentsQ.refetch(); tagsQ.refetch(); }}>
            다시 불러오기
          </button>
        </div>
      ) : instrumentsQ.isSuccess && target.instIds.length === 0 ? (
        <div css={s.stateBox}>
          <strong>{target.name} 레슨은 아직 서비스에서 분류하고 있지 않아요.</strong>
          <span>다른 후보를 골라보세요.</span>
        </div>
      ) : lessonsQ.isError ? (
        <div css={s.stateBox} role="alert">
          <strong>레슨을 불러오지 못했어요.</strong>
          <span>{getErrorMessage(lessonsQ.error, "잠시 후 다시 시도해주세요.")}</span>
          <button type="button" css={s.smallBtn} onClick={() => lessonsQ.refetch()}>
            다시 불러오기
          </button>
        </div>
      ) : lessonsQ.isPending ? (
        <div css={s.stateBox} aria-busy="true">
          레슨을 찾는 중...
        </div>
      ) : lessons.length === 0 ? (
        // 다른 지역·다른 악기로 몰래 넓히지 않음. 추천 결과도 그대로
        <div css={s.stateBox}>
          <strong>
            {regionText(region)}의 {target.name} 레슨은 아직 없어요.
          </strong>
          <span>지역을 바꾸거나 다른 후보의 레슨을 볼 수 있어요. 내 스타일 결과는 그대로예요.</span>
          <div css={s.stateActions}>
            <button type="button" css={s.smallBtn} onClick={focusRegion}>
              지역 바꾸기
            </button>
            {others.map((c) => (
              <button key={c.id} type="button" css={s.smallBtn} onClick={() => onSelect(c.id)}>
                {c.name} 레슨 보기
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p css={s.note}>
            {regionText(region)}의 {target.name} 레슨 {lessons.length}개예요. 강사의 대표 지역이나 활동 가능 지역이 이 지역인 레슨만 보여줘요.{" "}
            {sortParts.length
              ? `${sortParts.join("와 ")}를 먼저 보여주고, 나머지는 최신 등록순이에요. 거리순이 아니에요.`
              : "최신 등록순으로 보여줘요. 거리순이 아니에요."}
          </p>
          <div css={s.lessonGrid}>
            {lessons.map((l) => (
              <LessonCard key={l.lessonId} lesson={l} region={region} onOpen={() => setOpenLessonId(l.lessonId)} />
            ))}
          </div>
        </>
      )}

      <LessonDetailDrawer open={openLessonId != null} lessonId={openLessonId} onClose={() => setOpenLessonId(null)} />
    </section>
  );
});

function LessonCard({ lesson: l, region, onOpen }: { lesson: RecommendedLesson; region: StoredRegion; onOpen: () => void }) {
  return (
    <article css={s.lessonCard}>
      {/* 샘플(시연용) 계정 레슨은 개발 환경에서만 내려옴 */}
      {l.sample && (
        <span css={s.sampleBadge} title="개발 환경에서만 보이는 시연용 데이터예요">
          샘플 · 시연용
        </span>
      )}
      <button type="button" css={s.lessonOpen} onClick={onOpen} aria-label={`${l.title} 레슨 자세히 보기`}>
        <span css={s.lessonMeta}>
          <strong>{l.instName}</strong> · {LESSON_MODE_LABEL[l.mode] ?? l.mode} · {l.durationMin}분 · <strong>{priceText(l.price)}</strong>
        </span>
        <h4>{l.title}</h4>
      </button>

      {l.styleTags.length > 0 ? (
        <ul css={s.tagRow} aria-label="강사가 등록한 레슨 특징 (겹치는 특징은 진하게)">
          {l.styleTags.map((t) => {
            const matched = l.matchedTagIds.includes(t.lessonStyleTagId);
            return (
              <li key={t.lessonStyleTagId} css={s.tag(matched)}>
                {matched ? "✓ " : ""}
                {t.styleName}
              </li>
            );
          })}
          {l.modeMatched && <li css={s.tag(true)}>✓ 원하는 수업 방식</li>}
        </ul>
      ) : (
        <span css={s.lessonMeta}>{l.modeMatched ? "✓ 원하는 수업 방식 · " : ""}등록된 레슨 특징 정보가 없어요</span>
      )}

      <div css={s.artistRow}>
        <ProfileAvatar src={l.artistProfileImgUrl} name={l.artistName} size={24} />
        <Link to={`/artists/${l.artistProfileId}`}>{l.artistName}</Link>
      </div>
      <span css={s.regionLine}>
        {l.regionMatch === "MAIN" ? `대표 지역 · ${regionText(l.artistMainRegion)}` : `활동 가능 지역에 ${regionText(region)} 포함`}
      </span>
    </article>
  );
}

export default LessonFinder;
