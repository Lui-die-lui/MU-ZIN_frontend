export const loadDaumPostcodeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.daum?.Postcode) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="postcode.v2.js"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("다음 주소검색 스크립트 로드 실패")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("다음 주소검색 스크립트 로드 실패"));

    document.head.appendChild(script);
  });
};
