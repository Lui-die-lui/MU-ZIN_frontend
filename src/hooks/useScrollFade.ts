import { useEffect, useRef } from "react";

// 옆으로 넘기는 줄의 끝을 흐리게 - 더 넘길 내용이 있는 쪽에만 (data-fade="left|right|both")
export const useScrollFade = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const left = el.scrollLeft > 1;
      const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      const fade = left && right ? "both" : left ? "left" : right ? "right" : "";
      if (fade) el.dataset.fade = fade;
      else delete el.dataset.fade;
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // 칩이 늘거나 줄어도 다시 계산
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return ref;
};
