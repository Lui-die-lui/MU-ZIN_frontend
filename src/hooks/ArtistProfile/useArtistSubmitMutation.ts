import { useMutation } from "@tanstack/react-query";
import type { ApplyArtistPayload } from "../../Types/artistApplyTypes";
import {
  saveDraftArtistProfileReq,
  setMyInstrumentReq,
  submitArtistApplicationReq,
} from "../../apis/artist/artistApi";
import { queryClient } from "../../configs/queryClient";

// 제출
export function useArtistSubmitMutation() {
  return useMutation({
    // 버튼을 누르면 실제로 실행되는 함수
    mutationFn: async (p: ApplyArtistPayload) => {
      await saveDraftArtistProfileReq({
        bio: p.bio,
        career: p.career,
        majorName: p.majorName,
      });

      await setMyInstrumentReq({ instrumentIds: p.instrumentIds });
      await submitArtistApplicationReq();
      // 한번 제출이지만 서버가 3단계로 분리되어있어 조합하고있기때문에 await가 3번
    },
    onSuccess: async () => { // 캐시 무효화가 일어남 제출 성공 시 
      await queryClient.invalidateQueries({ queryKey: ["principal"] }); // 내 로그인 사용자 정보 다시 가져옴
      await queryClient.invalidateQueries({ queryKey: ["myArtistProfile"] }); // 내 아티스트 프로필도 다시 가져옴
    },
    // 제출 성공 후 화면에서 바로 심사중(pending) 같은 상태 반영완료
  });
}
