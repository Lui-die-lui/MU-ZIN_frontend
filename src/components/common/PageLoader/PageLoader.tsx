/** @jsxImportSource @emotion/react */
import * as s from "./styles";

// 화면 전체를 기다릴 때 (로그인 정보 복구 등) - 점 세 개가 차례로 떠오름
//  - 금방 끝나면 깜빡이지 않게 잠깐 뒤에 나타남 (styles 의 delay)
//  - 화면 낭독기에는 "불러오는 중"으로 읽힘
function PageLoader({ label = "불러오는 중" }: { label?: string }) {
  return (
    <div css={s.wrap} role="status" aria-live="polite">
      <span css={s.dots} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span css={s.srOnly}>{label}</span>
    </div>
  );
}

export default PageLoader;
