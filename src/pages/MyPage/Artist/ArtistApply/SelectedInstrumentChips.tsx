/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { useArtistApplyFormStore } from "../../../../stores/useArtistApplyFormStore";

function SelectedInstrumentChips({ disabled }: { disabled: boolean }) {
  const selected = useArtistApplyFormStore((x) => x.selectedInstruments);
  const remove = useArtistApplyFormStore((x) => x.removeInstrument);

  if (selected.length === 0) return null;
  return (
    <div css={s.chipWrap}>
      {selected.map((inst) => (
        <button
          key={inst.instId}
          type="button"
          css={s.chip}
          disabled={disabled}
          onClick={() => remove(inst.instId)}
          title="클릭시 삭제"
        >
          {inst.instName}
          <span css={s.chipX}>×</span>
        </button>
      ))}
    </div>
  );
}

export default SelectedInstrumentChips;
