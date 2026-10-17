/** @jsxImportSource @emotion/react */
import { useState, type FormEvent } from "react";
import { DEFAULT_ARTIST_SEARCH_DRAFT, type ArtistSearchDraft } from "../../../Types/artistSearchTypes";
import ArtistSearchInput from "./ArtistSearchInput/ArtistSearchInput";
import StyleDropdown from "./StyleDropdown/StyleDropdown";
import InstFilterDropdown from "../../Lesson/InstFilterDropdown/InstFilterDropdown";
import RegionSearchInput from "./RegionSearchInput/RegionSearchInput";
import * as s from "./styles";

type Props = {
  initialValue: ArtistSearchDraft;
  onSearch: (draft: ArtistSearchDraft) => void;
  onReset: () => void;
  resetKey: number;
  isSearching?: boolean;
};

function ArtistSearch({ initialValue, onSearch, onReset, resetKey, isSearching = false }: Props) {
  const [draft, setDraft] = useState(initialValue);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(draft);
  };

  return (
    <form css={s.searchSection} onSubmit={submit}>
      <label css={s.keywordGroup}>
        <span css={s.fieldLabel}>검색어</span>
        <ArtistSearchInput
          value={draft.keyword}
          onChangeValue={(value) => setDraft((prev) => ({ ...prev, keyword: value }))}
        />
      </label>

      <div css={s.filterGrid}>
        <div css={s.filterGroup}>
          <span css={s.fieldLabel}>레슨 스타일</span>
          <StyleDropdown
            lessonStyleTagIds={draft.styleTagIds}
            onChangeStyleTagIds={(ids) => setDraft((prev) => ({ ...prev, styleTagIds: ids }))}
          />
        </div>
        <div css={s.instrumentGroup}>
          <span css={s.fieldLabel}>악기</span>
          <InstFilterDropdown
            category={draft.instCategory}
            onChangeCategory={(value) => setDraft((prev) => ({ ...prev, instCategory: value }))}
            instIds={draft.instIds}
            onChangeInstIds={(ids) => setDraft((prev) => ({ ...prev, instIds: ids }))}
            resetOnCategoryChange
          />
        </div>
      </div>

      <div css={s.regionGroup}>
        <span css={s.fieldLabel}>활동 지역</span>
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

      <div css={s.buttonGroup}>
        <button type="button" css={s.resetButton} onClick={() => {
          setDraft(DEFAULT_ARTIST_SEARCH_DRAFT);
          onReset();
        }}>초기화</button>
        <button type="submit" css={s.searchButton} disabled={isSearching}>
          {isSearching ? "검색 중..." : "아티스트 검색"}
        </button>
      </div>
    </form>
  );
}

export default ArtistSearch;
