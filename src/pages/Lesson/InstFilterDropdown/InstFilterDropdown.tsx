/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import SelectDropdown from "../../../components/common/SelectDropdown/SelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getInstrumentCategoriesReq,
  getInstrumentsReq,
} from "../../../apis/instrument/instrumentApis";
import {
  INST_CATEGORY_LABEL,
  type InstrumentCategory,
  type InstrumentResponse,
} from "../../../Types/instrumentTypes";

// 빈 배열
const EMPTY_INSTRUMENTS: InstrumentResponse[] = [];

type Props = {
  category: InstrumentCategory | "ALL";
  onChangeCategory: (v: InstrumentCategory | "ALL") => void;
  instIds: number[];
  onChangeInstIds: (v: number[]) => void;

  resetOnCategoryChange?: boolean; // 아티스트 전환 로직에도 써야해서
};

function InstFilterDropdown({
  category,
  onChangeCategory,
  instIds,
  onChangeInstIds,
  resetOnCategoryChange = false,
}: Props) {
  const [open, setOpen] = useState(false);
  // 드롭다운 input 검색 문자열
  const [keyword, setKeyword] = useState("");

  // 바깥 클릭 감지용
  const rootRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["instrumentCategories"],
    queryFn: async () =>
      (await getInstrumentCategoriesReq()).data as InstrumentCategory[], // emum으로 타입 확정시키기
    staleTime: 10 * 60 * 1000,
  });

  const q = keyword.trim();

  const { data: instResp, isFetching } = useQuery({
    queryKey: ["instruments", category, category === "ALL" ? q : ""],
    queryFn: async () => {
      // 카테고리 선택 시 - 서버는 카테고리만, 검색어는 프론트에서 필터
      if (category !== "ALL")
        return (await getInstrumentsReq({ category })).data;

      // 카테고리 없애고 검색어만 - 서버 쿼리 검색
      if (q) return (await getInstrumentsReq(q ? { q } : undefined)).data;

      // 전체 다 입력이 없는 상태로 검색
      return (await getInstrumentsReq()).data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 데이터 없으면 빈 배열
  const baseList = instResp ?? EMPTY_INSTRUMENTS;

  const instruments = useMemo(() => {
    // useMemo - 함수의 값을 저장
    const q = keyword.trim().toLowerCase();
    if (!q) return baseList;

    // 카테고리 선택 상태에선 서버가 category만 걸고 오니까 여기서 쿼리(q) 필터
    if (category !== "ALL") {
      return baseList.filter((i) => i.instName.toLowerCase().includes(q));
    }
    return baseList;
  }, [baseList, keyword, category]);

  const selectedCount = instIds.length;

  const toggle = (id: number) => {
    onChangeInstIds(
      instIds.includes(id) ? instIds.filter((x) => x !== id) : [...instIds, id],
    );
  };

  const clear = () => onChangeInstIds([]);

  const handleChangeCategory = (v: InstrumentCategory | "ALL") => {
    onChangeCategory(v);
    if (resetOnCategoryChange) onChangeInstIds([]); // 카테고리 바꾸면 악기 선택 초기화 - 정확한 카테고리 선택을 위해
    setKeyword("");
  };

  // 바깥 클릭/esc 닫기
  useEffect(() => {
    if (!open) return;

    const onDocDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div css={s.wrap} ref={rootRef}>
      {/* 카테고리 드롭다운 */}
      <SelectDropdown<InstrumentCategory | "ALL">
        css={s.select}
        ariaLabel="악기군 선택"
        value={category}
        onChange={handleChangeCategory}
        options={[
          { value: "ALL", label: "악기군 전체" },
          ...categories.map((c) => ({ value: c, label: INST_CATEGORY_LABEL[c] })),
        ]}
      />

      {/* 악기 멀티 드롭다운 */}
      <div css={s.dropdownRoot}>
        <button
          type="button"
          css={s.trigger}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {selectedCount ? `악기 ${selectedCount}개 선택됨` : "악기 선택"}
          <span css={s.caret(open)} aria-hidden="true" />
        </button>

        {open && (
          <div css={s.menu}>
            <div css={s.menuTop}>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="악기 검색 (예: 플룻)"
                aria-label="악기 검색"
                css={s.searchInput}
              />
              <button type="button" onClick={clear} css={s.clearBtn}>
                전체 해제
              </button>
            </div>

            <div css={s.list}>
              {isFetching && <div css={s.hint}>불러오는 중...</div>}
              {!isFetching && instruments.length === 0 && (
                <div css={s.hint}>결과가 없어요.</div>
              )}

              {instruments.map((i: InstrumentResponse) => {
                const checked = instIds.includes(i.instId);
                return (
                  <label key={i.instId} css={s.item(checked)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(i.instId)}
                    />
                    <span>{i.instName}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstFilterDropdown;
