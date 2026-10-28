/** @jsxImportSource @emotion/react */
import { useState } from "react";
import PushGuideModal from "./PushGuideModal";
import { usePrincipalState } from "../../stores/usePrincipalState";
import { ackGuide, isGuideAcked, isGuideLater, laterGuide } from "../../push/pushGuideStorage";

// 홈 화면: 로그인했고 이 기기에서 안내를 확인하지 않았으면 알림 설정 안내를 띄움
//  - 로그인 복구가 끝나기 전(hydrated=false)엔 판단하지 않음 -> 잠깐 떴다 사라지지 않게
//  - 저장값은 바로 읽히는 브라우저 저장소라 기다릴 것이 없음
function PushGuideGate() {
  const hydrated = usePrincipalState((st) => st.hydrated);
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const [closedFor, setClosedFor] = useState<number | null>(null);

  const open = hydrated && userId != null && closedFor !== userId && !isGuideAcked(userId) && !isGuideLater(userId);
  if (!open || userId == null) return null;

  return (
    <PushGuideModal
      open
      onLater={() => {
        laterGuide(userId);
        setClosedFor(userId);
      }}
      onDone={() => {
        ackGuide(userId);
        setClosedFor(userId);
      }}
    />
  );
}

export default PushGuideGate;
