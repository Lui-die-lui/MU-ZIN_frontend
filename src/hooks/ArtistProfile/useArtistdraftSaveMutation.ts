import { useMutation } from "@tanstack/react-query";
import type { ApplyArtistPayload } from "../../Types/artistApplyTypes";
import {
  saveDraftArtistProfileReq,
  setMyInstrumentReq,
} from "../../apis/artist/artistApi";
import { queryClient } from "../../configs/queryClient";

// 저장
export function useArtistDraftSaveMutation() {
  return useMutation({
    mutationFn: async (p: ApplyArtistPayload) => {
      await saveDraftArtistProfileReq({
        bio: p.bio,
        career: p.career,
        majorName: p.majorName,
      });
      await setMyInstrumentReq({ instrumentIds: p.instrumentIds });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["principal"] });
      await queryClient.invalidateQueries({ queryKey: ["myArtistProfile"] });
    },
  });
}
