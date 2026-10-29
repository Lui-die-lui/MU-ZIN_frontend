import { PiMetronomeFill } from "react-icons/pi";

// AI 레슨 내비게이터 표시 - 메트로놈. 크기는 감싸는 곳에서 정하고 색은 글자 색을 따름
function AssistantIcon({ size }: { size?: number }) {
  return <PiMetronomeFill size={size} aria-hidden="true" focusable="false" />;
}

export default AssistantIcon;
