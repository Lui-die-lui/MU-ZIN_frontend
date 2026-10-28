// 안내 카드용 선 아이콘 (차콜 한 색, 장식)
const base = { width: 36, height: 36, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };

export const BellIcon = () => (
  <svg {...base}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </svg>
);

export const ShareIcon = () => (
  <svg {...base}>
    <path d="M12 3v12" />
    <path d="M8 7l4-4 4 4" />
    <path d="M7 11H5v10h14V11h-2" />
  </svg>
);

export const HomeAddIcon = () => (
  <svg {...base}>
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <path d="M12 8.5v7M8.5 12h7" />
  </svg>
);

export const OpenAppIcon = () => (
  <svg {...base}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
    <rect x="9.5" y="7" width="5" height="5" rx="1.4" />
    <path d="M11 18.5h2" />
  </svg>
);

export const BrowserIcon = () => (
  <svg {...base}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 9h18M6.5 6.8h.01M9 6.8h.01" />
  </svg>
);

export const InfoIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);
