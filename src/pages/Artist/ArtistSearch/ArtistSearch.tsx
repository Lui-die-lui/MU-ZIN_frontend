/** @jsxImportSource @emotion/react */
import { useState, type FormEvent } from "react";
import { PiMagnifyingGlassBold, PiSlidersHorizontalBold, PiUserCheckBold } from "react-icons/pi";
import { DEFAULT_ARTIST_SEARCH_DRAFT, type ArtistSearchDraft } from "../../../Types/artistSearchTypes";
import { INSTRUMENT_CATEGORIES, INST_CATEGORY_LABEL, type InstrumentCategory } from "../../../Types/instrumentTypes";
import StyleDropdown from "./StyleDropdown/StyleDropdown";
import InstFilterDropdown from "../../Lesson/InstFilterDropdown/InstFilterDropdown";
import RegionSearchInput from "./RegionSearchInput/RegionSearchInput";
import * as ui from "../../../components/search/searchStyles";
import { useScrollFade } from "../../../hooks/useScrollFade";
import * as s from "./styles";

// 칩으로 바로 고르는 악기군 (기타 'etc' 는 상세 조건의 악기에서)
const CATEGORY_CHIPS: (InstrumentCategory | "ALL")[] = ["ALL", ...INSTRUMENT_CATEGORIES.filter((c) => c !== "ETC")];

type Props = {
  initialValue: ArtistSearchDraft;
  onSearch: (draft: ArtistSearchDraft) => void;
  onReset: () => void;
  resetKey: number;
  isSearching?: boolean;
  // 팔로우한 아티스트만 (로그인했을 때만 보임)
  followed?: { on: boolean; onToggle: () => void } | null;
};

// 아티스트 찾기 검색 - 알약 검색창 → [상세 조건 | 팔로우 | 악기군 칩] → 접히는 상세 조건
function ArtistSearch({ initialValue, onSearch, onReset, resetKey, isSearching = false, followed }: Props) {
  const toolbarRef = useScrollFade<HTMLDivElement>();
  const [draft, setDraft] = useState(initialValue);
  // 상세 조건(접힌 곳)에 적용된 개수 - 상세 조건 버튼에 표시
  const detailCount = [initialValue.styleTagIds.length, initialValue.instIds.length, initialValue.region1DepthName].filter(Boolean).length;
  const [panelOpen, setPanelOpen] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(draft);
  };

  // 악기군 칩: 바로 적용 (악기군이 바뀌면 고른 악기는 비움)
  const pickCategory = (instCategory: InstrumentCategory | "ALL") => {
    const next = { ...draft, instCategory, instIds: instCategory === draft.instCategory ? draft.instIds : [] };
    setDraft(next);
    onSearch(next);
  };

  return (
    <form css={s.form} onSubmit={submit}>
      <div css={ui.searchPill}>
        <PiMagnifyingGlassBold css={ui.searchIcon} size={18} aria-hidden="true" />
        <input
          css={ui.searchInput}
          aria-label="아티스트 검색어"
          value={draft.keyword}
          onChange={(e) => setDraft((prev) => ({ ...prev, keyword: e.target.value }))}
          placeholder="아티스트명, 전공명 등으로 검색"
        />
        <button type="submit" css={ui.searchButton} disabled={isSearching}>
          검색
        </button>
      </div>

      <div css={ui.toolbar} ref={toolbarRef}>
        <button
          type="button"
          css={ui.chip(panelOpen)}
          aria-expanded={panelOpen}
          aria-controls="artist-filter-panel"
          onClick={() => setPanelOpen((v) => !v)}
        >
          <PiSlidersHorizontalBold size={15} aria-hidden="true" />
          상세 조건
          {detailCount > 0 && <span css={ui.chipCount(panelOpen)}>{detailCount}</span>}
        </button>
        {followed && (
          <button type="button" css={ui.chip(followed.on)} aria-pressed={followed.on} onClick={followed.onToggle}>
            <PiUserCheckBold size={15} aria-hidden="true" />
            팔로우한 아티스트
          </button>
        )}
        <span css={ui.divider} aria-hidden="true" />
        <div css={s.chipGroup} role="group" aria-label="악기군">
          {CATEGORY_CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              css={ui.chip(initialValue.instCategory === c)}
              aria-pressed={initialValue.instCategory === c}
              onClick={() => pickCategory(c)}
            >
              {c === "ALL" ? "전체" : INST_CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {panelOpen && (
        <div id="artist-filter-panel" css={ui.panel}>
          <div css={ui.panelGrid}>
            <div css={ui.field}>
              <span css={ui.fieldLabel}>악기</span>
              <InstFilterDropdown
                category={draft.instCategory}
                onChangeCategory={(value) => setDraft((prev) => ({ ...prev, instCategory: value }))}
                instIds={draft.instIds}
                onChangeInstIds={(ids) => setDraft((prev) => ({ ...prev, instIds: ids }))}
                resetOnCategoryChange
              />
            </div>
            <div css={ui.field}>
              <span css={ui.fieldLabel}>레슨 스타일</span>
              <StyleDropdown
                lessonStyleTagIds={draft.styleTagIds}
                onChangeStyleTagIds={(ids) => setDraft((prev) => ({ ...prev, styleTagIds: ids }))}
              />
            </div>
            <div css={ui.fieldWide}>
              <span css={ui.fieldLabel}>활동 지역</span>
              <RegionSearchInput
                key={resetKey}
                value={{
                  region1DepthName: draft.region1DepthName,
                  region2DepthName: draft.region2DepthName,
                  region3DepthName: draft.region3DepthName,
                }}
                onChange={(updater) => {
                  setDraft((prev) => {
                    const current = {
                      region1DepthName: prev.region1DepthName,
                      region2DepthName: prev.region2DepthName,
                      region3DepthName: prev.region3DepthName,
                    };
                    const next = typeof updater === "function" ? updater(current) : updater;
                    return { ...prev, ...next };
                  });
                }}
              />
            </div>
          </div>
          <div css={ui.panelActions}>
            <button
              type="button"
              css={ui.ghostButton}
              onClick={() => {
                setDraft(DEFAULT_ARTIST_SEARCH_DRAFT);
                onReset();
              }}
            >
              초기화
            </button>
            <button type="submit" css={ui.primaryButton} disabled={isSearching}>
              조건 적용
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default ArtistSearch;
