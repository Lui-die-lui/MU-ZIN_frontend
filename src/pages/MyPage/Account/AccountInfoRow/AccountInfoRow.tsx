/** @jsxImportSource @emotion/react */
import type { ReactNode } from "react";
import * as s from "./styles";

type Props = {
  label: ReactNode;
  children: ReactNode;
  action?: ReactNode;
};

function AccountInfoRow({ label, children, action }: Props) {
  return (
      <div css={s.row}>
      <div css={s.label}>{label}</div>
      <div css={s.content}>{children}</div>
      <div css={s.action}>{action}</div>
    </div>
  );
}

export default AccountInfoRow;
