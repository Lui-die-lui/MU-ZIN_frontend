import React, { useMemo, useState } from "react";
import { userArtistApplyFormStore } from "../../../../stores/useArtistApplyFormStore";
import { useQuery } from "@tanstack/react-query";
import { getInstrumentsReq } from "../../../../apis/instrument/instrumentApis";
import type { InstrumentResponse } from "../../../../Types/instrumentTypes";
import InstFilterDropdown from "../../../Lesson/InstFilterDropdown/InstFilterDropdown";

// 검색에서 사용되는 드롭다운 컴포넌트랑 이어주는 어댑터
// 객체 싱크를 도와줌
function ApplyInstrumentPicker({ disabled }: { disabled: boolean }) {
  const [category, setCategory] = useState<"ALL" | string>("ALL");

  const instIds = userArtistApplyFormStore((s) => s.instrumentIds);
  const selected = userArtistApplyFormStore((s) => s.selectedInstruments);
  const setSelected = userArtistApplyFormStore((s) => s.setSelectedInstruments);

  // 칩 이름 유지하려면 전체 악기목록을 프론트상에서 한번 불러와줘야함
  const { data: allInstruments = [] } = useQuery({
    queryKey: ["instruments_all_for_chip"],
    queryFn: async () =>
      (await getInstrumentsReq()).data as InstrumentResponse[],
    staleTime: 10 * 60 * 1000,
  });

  const instMap = useMemo(() => {
    const m = new Map<number, InstrumentResponse>();
    for (const i of allInstruments) m.set(i.instId, i); // 이게 뭔데
    // 이미 store에 있던 애들도 맵에 채워줘서 완전 안정화 시키기
    for (const i of selected) m.set(i.instId, i); // 설마 for 문임?
    return m;
  }, [allInstruments, selected]);

  const onChangeInstIds = (ids: number[]) => {
    const list = ids
      .map((id) => instMap.get(id))
      .filter((v): v is InstrumentResponse => !!v); // 뭔데

    setSelected(list);
  };

  return (
    <div
      style={{
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <InstFilterDropdown
        category={category}
        onChangeCategory={setCategory}
        instIds={instIds}
        onChangeInstIds={onChangeInstIds}
      />
    </div>
  );
}

export default ApplyInstrumentPicker;
