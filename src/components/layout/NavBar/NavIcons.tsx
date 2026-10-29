// 상단 바 채팅·알림 아이콘 - Remix Line(chat-3, notification-3) 모양을 선으로 다시 그림 (선 굵기를 조절하려고)
// 크기는 글자 크기(1em), 색은 글자 색을 따름

type Props = { strokeWidth?: number };

export function ChatIcon({ strokeWidth = 1.6 }: Props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" aria-hidden="true">
      <path d="M7.5 19.8A9 9 0 1 0 4.2 16.5L3 21Z" />
    </svg>
  );
}

export function BellIcon({ strokeWidth = 1.6 }: Props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 18v-8a7 7 0 0 1 14 0v8" />
      <path d="M3 18h18" />
      <path d="M10 21.5h4" />
    </svg>
  );
}
