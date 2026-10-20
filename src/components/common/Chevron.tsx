// 원형 버튼 안 꺾쇠 - 선을 돌려 그리던 방식은 원 가운데에서 1~2px 어긋나서 SVG 로 (24 격자 가운데에 맞춤)
function Chevron({ dir = "right", size = 18 }: { dir?: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d={dir === "right" ? "M9.5 6l6 6-6 6" : "M14.5 6l-6 6 6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Chevron;
