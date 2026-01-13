import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef } from "react";
import { useArtistApplyFormStore } from "../../../../../stores/useArtistApplyFormStore";
import {
  getMyArtistProfileReq,
  setMyInstrumentReq,
} from "../../../../../apis/artist/artistApi";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";
import ApplyInstrumentPicker from "../../../Artist/ArtistApply/ApplyInstrumentPicker";
import SelectedInstrumentChips from "../../../Artist/ArtistApply/SelectedInstrumentChips";

function InstrumentSection() {
  const qc = useQueryClient();

  // store  - 이미 악기 관련 사용하고 있는 로직 재사용(동작은 동일함)
  const instIds = useArtistApplyFormStore((s) => s.instrumentIds);
  const selected = useArtistApplyFormStore((s) => s.selectedInstruments);
  const setSelected = useArtistApplyFormStore((s) => s.setSelectedInstruments);

  // 내 아티스트 프로필 조회
  const { data: profile } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => (await getMyArtistProfileReq()).data.data,
  });

  // 서버 값으로 store를 처음에만 주입해야함
  // 아니면 사용자가 선택을 바꾸는 순간 다시 서버값으로 덮어씌워짐 - 제출 로직과 동일
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!profile) return;
    if (didInitRef.current) return; // 값이 바뀌지 않았으면 그냥 리턴

    // profile이 가진 악기들이 instResponse gudxo(혹은 유사) 라고 가정
    const serverList = (profile.instruments ?? []) as InstrumentResponse[];

    // store에 주입 (해당 함수가  instIds까지 세팅해주면 좋음)
    setSelected(serverList);

    didInitRef.current = true; // 바뀌면 true
  }, [profile, setSelected]);

  // 저장 mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      // store의 instIds 기준으로 저장
      const body = { instrumentIds: instIds };
      const res = await setMyInstrumentReq(body);
      return res.data.data;
    },
    onSuccess: async (updated) => {
      // 서버 캐시 최신화
      await qc.invalidateQueries({ queryKey: ["artistProfile", "me"] });
      // 아티스트 상태/뱃지 등 연동할때 필요
      await qc.invalidateQueries({ queryKey: ["principal"] });

      // 응답에 instruments 가 들어오면 store도 동기화
      if (updated?.instruments) {
        setSelected(updated.instruments as InstrumentResponse[]);
      }

      alert("악기 저장 완료");
    },
    onError: () => {
      alert("악기 저장 실패");
    },
  });

  const locked = saveMutation.isPending;

  const isDirty = useMemo(() => {
    // 서버값이랑 store 값 비교해서 저장 버튼 제어
    const serverIds = ((profile?.instruments ?? []) as InstrumentResponse[])
      .map((x) => x.instId)
      .sort();
    const localIds = [...(instIds ?? [])].sort();
    return JSON.stringify(serverIds) !== JSON.stringify(localIds);
  }, [profile, instIds]);

  return (
    <section
      style={{
        marginTop: 16,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <h3>악기</h3>

      <ApplyInstrumentPicker disabled={locked} />
      <SelectedInstrumentChips disabled={locked} />

      <button
        style={{ marginTop: 12 }}
        disabled={saveMutation.isPending || !isDirty}
        onClick={() => saveMutation.mutate()}
      >
        {saveMutation.isPending ? "저장중..." : "악기 저장"}
      </button>
    </section>
  );
}

export default InstrumentSection;
