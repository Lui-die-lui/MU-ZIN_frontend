/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { IOSSwitch } from "../../../../../components/common/StatusToggleSwitch/IOSSwitch";

type Props = {
  active: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
};

export default function LessonStatusControl({ active, onToggle, disabled }: Props) {
  return (
    <div css={s.rightControls}>
      <IOSSwitch
        checked={active}
        disabled={disabled}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <span css={s.badge(active)}>{active ? "활성" : "비활성"}</span>
    </div>
  );
}