/** @jsxImportSource @emotion/react */
import * as s from "./styles";

export type BasisOption<T extends string> = { value: T; label: string };
export type Draft<T extends string> = {
  basis: T;
  range: { from?: string; to?: string };
};

function DateSearchBar() {
  return <div></div>;
}

export default DateSearchBar;
