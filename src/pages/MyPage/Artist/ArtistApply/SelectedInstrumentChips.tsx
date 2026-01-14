/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { useArtistApplyFormStore } from "../../../../stores/useArtistApplyFormStore";
import SelectedChips from "../../../../components/common/SelectedChips/SelectedChips";

function SelectedInstrumentChips({ disabled }: { disabled: boolean }) {
  const selected = useArtistApplyFormStore((x) => x.selectedInstruments);
  const remove = useArtistApplyFormStore((x) => x.removeInstrument);

  if (selected.length === 0) return null;
  return (
   <SelectedChips
      disabled={disabled}
      items={selected}
      getKey={(inst) => inst.instId}
      getLabel={(inst) => inst.instName}
      onRemove={(inst) => remove(inst.instId)}
    />
  );
}

export default SelectedInstrumentChips;
