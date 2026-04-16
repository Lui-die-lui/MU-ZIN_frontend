import type { DaumPostcodeData } from "./artistRegionTypes";

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: (state: "FORCE_CLOSE" | "COMPLETE_CLOSE") => void;
      }) => {
        open: () => void;
      };
    };
  }
}

