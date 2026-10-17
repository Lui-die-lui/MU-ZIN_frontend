import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyArtistProfileReq,
  getMyArtistStyleTagsReq,
  setMyArtistStyleTagsReq,
  setMyInstrumentReq,
  updateApprovedProfileReq,
} from "../../apis/artist/artistApi";
import { getLessonStyleTagsReq } from "../../apis/lesson/lessonApis";
import { useArtistApplyFormStore } from "../../stores/useArtistApplyFormStore";
import { useMyLessonList } from "../Lesson/useLessonEdit";
import { artistKeys } from "../artistSearch/artistKeys";
import { getErrorMessage } from "../../utils/errorUtils";
import { normMain, normServices, sameIds } from "../../utils/artistProfileCompare";
import type { LessonStyleTagResponse } from "../../Types/lessonTypes";

// 서버 검증과 같은 기준 (ArtistProfileServiceImpl)
export const BIO_MAX = 255;
export const CAREER_MAX = 2000;
export const DETAIL_ADDRESS_MAX = 120;
export const MAX_STYLE_TAGS = 5;
export const MAX_SERVICE_REGIONS = 5;

export type ArtistSection = "bio" | "career" | "main" | "service" | "instruments" | "styles";
export type RowMessage = { type: "success" | "error"; text: string };

const profileKey = ["artistProfile", "me"] as const;
const myStyleKey = ["artistStyleTags", "me", "v2"] as const;

function useArtistAccount() {
  const qc = useQueryClient();

  const profileQ = useQuery({
    queryKey: profileKey,
    queryFn: async () => (await getMyArtistProfileReq()).data.data,
  });
  const profile = profileQ.data;

  // ---------- 소개 / 지역 / 악기 : 신청 화면과 같은 store (지역·악기 입력 컴포넌트를 같이 씀) ----------
  const bio = useArtistApplyFormStore((s) => s.bio);
  const career = useArtistApplyFormStore((s) => s.career);
  const mainRegion = useArtistApplyFormStore((s) => s.mainRegion);
  const serviceRegions = useArtistApplyFormStore((s) => s.serviceRegions);
  const instrumentIds = useArtistApplyFormStore((s) => s.instrumentIds);
  const setField = useArtistApplyFormStore((s) => s.setField);
  const hydrate = useArtistApplyFormStore((s) => s.hydrateFormProfile);
  const reset = useArtistApplyFormStore((s) => s.reset);

  // 처음 한 번만 서버 값으로 채움 (store 안에서 hydrated 로 막음) - 저장 후에는 다시 채우지 않고 서버 값과 비교만 함
  useEffect(() => {
    if (profile) hydrate(profile);
  }, [profile, hydrate]);

  // 화면을 떠나면 비워서 신청 화면 등과 섞이지 않게
  useEffect(() => () => reset(), [reset]);

  // ---------- 레슨 스타일 : 화면 안에서만 관리 (null = 아직 안 바꿈 -> 서버 값 사용) ----------
  const allTagsQ = useQuery({
    queryKey: ["lessonStyleTags", "v2"],
    queryFn: async () => {
      const arr = (await getLessonStyleTagsReq()).data.data;
      return Array.isArray(arr) ? arr : [];
    },
    staleTime: 10 * 60 * 1000,
  });
  const myTagsQ = useQuery({
    queryKey: myStyleKey,
    queryFn: async () => {
      const arr = (await getMyArtistStyleTagsReq()).data.data;
      return Array.isArray(arr) ? arr : [];
    },
  });
  const serverStyleIds = useMemo(() => (myTagsQ.data ?? []).map((t) => t.lessonStyleTagId), [myTagsQ.data]);
  const [editedStyleIds, setEditedStyleIds] = useState<number[] | null>(null);
  const styleIds = editedStyleIds ?? serverStyleIds;

  const tagMap = useMemo(() => {
    const m = new Map<number, LessonStyleTagResponse>();
    for (const t of allTagsQ.data ?? []) m.set(t.lessonStyleTagId, t);
    for (const t of myTagsQ.data ?? []) m.set(t.lessonStyleTagId, t);
    return m;
  }, [allTagsQ.data, myTagsQ.data]);
  const selectedStyles = styleIds.map((id) => tagMap.get(id)).filter((t): t is LessonStyleTagResponse => !!t);

  // ---------- 레슨에서 쓰는 악기 (빼면 서버가 거부함 -> 미리 안내) ----------
  const lessonsQ = useMyLessonList();
  const lessonsByInst = useMemo(() => {
    const m = new Map<number, { instName: string; titles: string[] }>();
    for (const l of lessonsQ.data ?? []) {
      const cur = m.get(l.instId) ?? { instName: l.instName, titles: [] };
      cur.titles.push(l.title);
      m.set(l.instId, cur);
    }
    return m;
  }, [lessonsQ.data]);

  // ---------- 변경 여부 (행마다) ----------
  const dirty: Record<ArtistSection, boolean> = useMemo(() => {
    if (!profile) return { bio: false, career: false, main: false, service: false, instruments: false, styles: false };
    return {
      bio: bio.trim() !== (profile.bio ?? "").trim(),
      career: career.trim() !== (profile.career ?? "").trim(),
      main: normMain(mainRegion) !== normMain(profile.mainRegion),
      service: normServices(serviceRegions) !== normServices(profile.serviceRegions),
      instruments: !sameIds(instrumentIds, (profile.instruments ?? []).map((i) => i.instId)),
      styles: editedStyleIds !== null && !sameIds(editedStyleIds, serverStyleIds),
    };
  }, [profile, bio, career, mainRegion, serviceRegions, instrumentIds, editedStyleIds, serverStyleIds]);
  const isDirty = Object.values(dirty).some(Boolean);

  // ---------- 행별 안내 문구 (내 정보 화면처럼 입력칸 아래에 성공/오류 표시) ----------
  const [messages, setMessages] = useState<Partial<Record<ArtistSection, RowMessage>>>({});
  const setMessage = (key: ArtistSection, m: RowMessage | undefined) =>
    setMessages((prev) => ({ ...prev, [key]: m }));

  const validate = (key: ArtistSection): string | null => {
    switch (key) {
      case "bio":
        if (!bio.trim()) return "소개를 입력해주세요. 수강생이 가장 먼저 보는 내용이에요.";
        if (bio.length > BIO_MAX) return `소개는 ${BIO_MAX}자 이하로 입력해주세요.`;
        return null;
      case "career":
        if (!career.trim()) return "경력을 입력해주세요.";
        if (career.length > CAREER_MAX) return `경력은 ${CAREER_MAX}자 이하로 입력해주세요.`;
        return null;
      case "main":
        if ((mainRegion?.detailAddress ?? "").length > DETAIL_ADDRESS_MAX)
          return `상세 주소는 ${DETAIL_ADDRESS_MAX}자 이하로 입력해주세요.`;
        return null;
      case "instruments": {
        if (instrumentIds.length === 0) return "악기를 1개 이상 선택해주세요. 레슨을 만들 때 이 중에서 고르게 돼요.";
        const removedInUse = [...lessonsByInst.entries()].filter(([id]) => !instrumentIds.includes(id));
        if (removedInUse.length === 0) return null;
        return (
          removedInUse
            .map(([, v]) => `'${v.instName}' 악기는 ${v.titles.map((t) => `「${t}」`).join(", ")} 레슨에서 쓰고 있어요`)
            .join(" / ") + ". 레슨 악기를 먼저 바꾸거나 레슨을 삭제한 뒤 빼주세요."
        );
      }
      default:
        return null;
    }
  };

  // ---------- 저장 (행 하나씩) ----------
  // 소개/경력/주소/서비스 지역은 같은 API(PUT /artist/profile/me)라서, 저장하는 항목만 화면 값으로 바꾸고 나머지는 서버 값 그대로 보냄
  // -> 다른 행에서 고치던 내용이 같이 저장되지 않음
  const saveMut = useMutation({
    meta: { skipGlobalError: true }, // 행 아래에 직접 표시
    mutationFn: async (key: ArtistSection) => {
      if (!profile) return key;
      if (key === "instruments") {
        await setMyInstrumentReq({ instrumentIds });
      } else if (key === "styles") {
        await setMyArtistStyleTagsReq({ styleTagIds: styleIds });
      } else {
        await updateApprovedProfileReq({
          bio: key === "bio" ? bio.trim() : profile.bio,
          career: key === "career" ? career.trim() : profile.career,
          majorName: profile.majorName,
          mainRegion:
            key === "main"
              ? mainRegion
                ? { ...mainRegion, detailAddress: mainRegion.detailAddress?.trim() || null }
                : null
              : (profile.mainRegion ?? null),
          serviceRegions: key === "service" ? serviceRegions : (profile.serviceRegions ?? []),
        });
      }
      return key;
    },
    onSuccess: (key) => {
      if (key === "styles") setEditedStyleIds(null);
      setMessage(key, { type: "success", text: "저장했어요. 공개 프로필에 바로 반영돼요." });
    },
    onError: (e, key) => setMessage(key, { type: "error", text: getErrorMessage(e, "저장하지 못했어요.") }),
    onSettled: async () => {
      // 저장된 행은 서버 값과 같아져서 "변경 없음"이 되고, 다른 행에서 고치던 값은 그대로 남음
      await Promise.all([
        qc.invalidateQueries({ queryKey: profileKey }),
        qc.invalidateQueries({ queryKey: ["artistStyleTags", "me"] }),
        // 공개 프로필/아티스트 검색 캐시 (예전엔 ["artistProfileDetail"] 이라는 쓰이지 않는 키를 지워서 공개 프로필이 3분간 예전 값이었음)
        qc.invalidateQueries({ queryKey: artistKeys.all }),
        qc.invalidateQueries({ queryKey: ["principal"] }),
      ]);
    },
  });

  const save = (key: ArtistSection) => {
    const err = validate(key);
    if (err) {
      setMessage(key, { type: "error", text: err });
      return;
    }
    setMessage(key, undefined);
    saveMut.mutate(key);
  };

  // 값을 고치면 그 행의 안내 문구는 지움
  const touch = (key: ArtistSection) => setMessage(key, undefined);

  return {
    profile,
    isLoading: profileQ.isLoading,
    isError: profileQ.isError,
    refetch: profileQ.refetch,

    bio,
    career,
    setBio: (v: string) => { setField("bio", v); touch("bio"); },
    setCareer: (v: string) => { setField("career", v); touch("career"); },
    touch,

    allTags: allTagsQ.data ?? [],
    stylesLoading: allTagsQ.isLoading || myTagsQ.isLoading,
    styleIds,
    selectedStyles,
    setStyleIds: (ids: number[]) => { setEditedStyleIds(ids); touch("styles"); },

    lessonsByInst,

    dirty,
    isDirty,
    messages,
    save,
    savingKey: saveMut.isPending ? saveMut.variables : null,
  };
}

export default useArtistAccount;
