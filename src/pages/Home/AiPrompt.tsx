/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as s from "./styles";
import AssistantIcon from "../../components/common/AssistantIcon";

// 메인 배너 > AI 레슨 내비게이터 진입: 입력창 모양의 링크 (실제 입력은 내비게이터 화면에서)
// 실제로 물어볼 만한 질문 예시가 아래에서 위로 떠오르며 바뀜 - 바뀔 때만 다시 그려서 타자 모션보다 가벼움
const EXAMPLES = [
  "부산 서면 근처에서 퇴근 후에 편하게 기타를 배우고 싶어.",
  "근처에 성인 피아노 꼼꼼하게 가르쳐 주는 곳 없나?",
  "주말 오전에 들을 수 있는 바이올린 레슨 있어?",
  "마포구에서 직장인 보컬 레슨, 평일 저녁으로 찾아줘.",
  "드럼은 처음인데 연습실 있는 레슨이면 좋겠어.",
] as const;

const INTERVAL_MS = 3600;

function AiPrompt() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      // 다른 탭에 있을 때는 넘기지 않음
      if (document.visibilityState === "visible") setI((n) => (n + 1) % EXAMPLES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Link to="/assistant" css={s.aiPrompt} aria-label="AI 레슨 내비게이터에게 원하는 레슨을 말로 물어보기">
      <span css={s.aiField} aria-hidden="true">
        {/* key 가 바뀌면 새 문장만 떠오르는 애니메이션을 다시 탐 */}
        <span key={i} css={s.aiText}>
          {EXAMPLES[i]}
        </span>
      </span>
      <span css={s.aiButton} aria-hidden="true">
        <AssistantIcon size={19} />
        <span>
          AI<span css={s.aiButtonMore}> 내비게이터</span>
        </span>
      </span>
    </Link>
  );
}

export default AiPrompt;
