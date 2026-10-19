/** @jsxImportSource @emotion/react */
import * as s from "./styles";

type Props = {
  page: number; // 0부터
  totalPages: number;
  onChange: (next: number) => void;
};

// 이전 / 다음만 있는 간단한 페이지 이동 (한 페이지면 숨김)
function Pager({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav css={s.pager} aria-label="페이지">
      <button type="button" css={s.btn(false)} disabled={page <= 0} onClick={() => onChange(page - 1)}>
        이전
      </button>
      <span>
        {page + 1} / {totalPages}
      </span>
      <button type="button" css={s.btn(false)} disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        다음
      </button>
    </nav>
  );
}

export default Pager;
