/** @jsxImportSource @emotion/react */
import { useQuery } from "@tanstack/react-query";
import * as s from "./styles";
import { getInstrumentsReq } from "../../apis/instrument/instrumentApis";
import { INST_CATEGORY_LABEL, INSTRUMENT_CATEGORIES, type InstrumentResponse } from "../../Types/instrumentTypes";

// 다른 악기도 둘러보기 (접힌 영역) - 서비스의 모든 악기를 분류별로 보여주고, 고르면 바로 선택 지역 레슨으로
// 분류 이름은 둘러보기 탭에서만 쓰고, 고르는 단위는 악기 하나씩
function ExploreInstruments({ selectedViewId, onPick }: { selectedViewId: string; onPick: (instId: number) => void }) {
  const instrumentsQ = useQuery({ queryKey: ["instruments", "all"], queryFn: async () => (await getInstrumentsReq()).data, staleTime: 30 * 60_000 });
  const groups = INSTRUMENT_CATEGORIES.map((cat) => ({
    cat,
    items: (instrumentsQ.data ?? []).filter((i: InstrumentResponse) => i.category === cat).sort((a, b) => a.instId - b.instId),
  })).filter((g) => g.items.length > 0);

  return (
    <details css={s.explore}>
      <summary>다른 악기도 둘러보기</summary>
      <div css={s.exploreBody}>
        <p css={[s.cardText, { color: "#6b7280", fontSize: 13 }]}>
          마음에 둔 악기가 따로 있다면 여기서 골라 선택 지역의 레슨을 바로 볼 수 있어요.
        </p>
        {instrumentsQ.isError ? (
          <div css={s.stateBox}>
            <strong>악기 목록을 불러오지 못했어요.</strong>
            <button type="button" css={s.smallBtn} onClick={() => instrumentsQ.refetch()}>
              다시 불러오기
            </button>
          </div>
        ) : instrumentsQ.isPending ? (
          <div css={s.stateBox}>악기 목록을 불러오는 중...</div>
        ) : (
          groups.map((g) => (
            <div key={g.cat} css={s.exploreGroup} role="group" aria-labelledby={`explore-${g.cat}`}>
              <h3 id={`explore-${g.cat}`}>{INST_CATEGORY_LABEL[g.cat]}</h3>
              <div css={s.hobbyTabs}>
                {g.items.map((i) => {
                  const on = selectedViewId === `inst:${i.instId}`;
                  return (
                    <button key={i.instId} type="button" css={s.hobbyTab(on)} aria-pressed={on} onClick={() => onPick(i.instId)}>
                      {i.instName}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </details>
  );
}

export default ExploreInstruments;
