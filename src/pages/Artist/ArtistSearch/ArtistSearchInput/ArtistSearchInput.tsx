/** @jsxImportSource @emotion/react */
import * as s from "./styles";

type Props = {
  value: string;
  onChangeValue: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
};

function ArtistSearchInput({
  value,
  onChangeValue,
  onEnter,
  placeholder = "아티스트명, 전공명 등으로 검색",
}: Props) {
  return (
    <input
      css={s.input}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onEnter?.();
      }}
      placeholder={placeholder}
    />
  );
}

export default ArtistSearchInput;
