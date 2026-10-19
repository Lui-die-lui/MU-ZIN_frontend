/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import { Global } from "@emotion/react";
import * as s from "./packStyles";
import { barcodeBars, instrumentSrc, labelCode, type HomeInstrument } from "./instruments";

// 메인 배너 비주얼: 신선식품처럼 투명 비닐에 포장된 악기 하나
// - 이미지 자리는 크기를 고정해 두고, 다 불러오면 서서히 보이게 (레이아웃 흔들림 없음)
// - 이미지를 못 불러와도 빈 포장만 남고 깨진 이미지 아이콘은 보이지 않음
function InstrumentPack({ inst }: { inst: HomeInstrument }) {
  const [loaded, setLoaded] = useState(false);
  const code = useMemo(() => barcodeBars(inst.key, inst.name), [inst.key, inst.name]);

  return (
    <div css={s.stage}>
      <Global styles={s.labelFontFace} />
      <div css={s.float}>
        <div css={s.pack}>
          {/* 위쪽 실링 + 걸이 구멍 */}
          <span css={s.seal} aria-hidden="true">
            <span css={s.hole} />
          </span>
          <img
            css={s.instrument(loaded)}
            src={instrumentSrc(inst.key)}
            alt={`투명 비닐에 포장된 3D ${inst.alt}`}
            width={480}
            height={480}
            decoding="async"
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
          />
          {/* 비닐 반사광 */}
          <span css={s.gloss} aria-hidden="true" />
          {/* 상품 라벨 */}
          <span css={s.label} aria-hidden="true">
            <b css={s.labelName}>{inst.name}</b>
            <svg css={s.barcode} width={code.width} viewBox={`0 0 ${code.width} 10`} preserveAspectRatio="none">
              {code.bars.map((b) => (
                <rect key={b.x} x={b.x} y={0} width={b.w} height={10} />
              ))}
            </svg>
            <small css={s.labelCode}>{labelCode(inst.key, inst.name)}</small>
          </span>
          {/* 아래쪽 실링 */}
          <span css={s.sealBottom} aria-hidden="true" />
        </div>
      </div>
      <span css={s.shadow} aria-hidden="true" />
    </div>
  );
}

export default InstrumentPack;
