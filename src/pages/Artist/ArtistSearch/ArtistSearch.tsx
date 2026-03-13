/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { type ArtistSearchDraft } from "../../../Types/artistSearchTypes";
import ArtistSearchInput from "./ArtistSearchInput/ArtistSearchInput";
import StyleDropdown from "./StyleDropdown/StyleDropdown";
import InstFilterDropdown from "../../Lesson/InstFilterDropdown/InstFilterDropdown";

type Props = {
  draft: ArtistSearchDraft;
  onChangeDraft: (
    updater: (prev: ArtistSearchDraft) => ArtistSearchDraft,
  ) => void;
  onSearch: () => void;
  onReset: () => void;
};

function ArtistSearch({ draft, onChangeDraft, onSearch, onReset }: Props) {
  return (
    <div css={s.searchSection}>
      <div css={s.searchBar}>
        <ArtistSearchInput
          value={draft.keyword}
          onChangeValue={(value) =>
            onChangeDraft((prev) => ({
              ...prev,
              keyword: value,
            }))
          }
          onEnter={onSearch}
        />
        <StyleDropdown
          lessonStyleTagIds={draft.styleTagIds}
          onChangeStyleTagIds={(ids) =>
            onChangeDraft((prev) => ({
              ...prev,
              styleTagIds: ids,
            }))
          }
        />

        <InstFilterDropdown
          category={draft.instCategory}
          onChangeCategory={(value) =>
            onChangeDraft((prev) => ({
              ...prev,
              instrumentCategory: value,
            }))
          }
          instIds={draft.instIds}
          onChangeInstIds={(ids) =>
            onChangeDraft((prev) => ({
              ...prev,
              instIds: ids,
            }))
          }
          resetOnCategoryChange
        />

        <button type="button" css={s.searchButton} onClick={onSearch}>
          검색
        </button>

        <button type="button" css={s.resetButton} onClick={onReset}>
          초기화
        </button>
      </div>
    </div>
  );
}

export default ArtistSearch;
