// 카카오맵 window 타입
declare global {
  interface Window {
    kekao?: {
      maps?: {
        services?: {
          Status: {
            OK: string;
          };
          Geocoder: new () => {
            coord2RegionCode: (
              longitude: number,
              latitude: number,
              callback: (
                result: KakaoRegionCodeResult[],
                status: string,
              ) => void,
            ) => void;
          };
        };
      };
    };
  }
}

export {};
