import { useEffect, useRef } from "react";

type Options = {
  enabled: boolean;
  onLoadMore: () => void;
};

export function useInfiniteScroll({ enabled, onLoadMore }: Options) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "280px 0px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onLoadMore]);

  return targetRef;
}
