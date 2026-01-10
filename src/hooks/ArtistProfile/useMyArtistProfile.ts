// 제출 안하고 저장 시 신청서 초기 값 세팅
// 서버에서 가져온 데이터 관리(서버 데이터 동기화)
import { useQuery } from "@tanstack/react-query";
import { getMyArtistProfileReq } from "../../apis/artist/artistApi";

export function useMyArtistProfile() {
  return useQuery({
    queryKey: ["myArtistProfile"],
    queryFn: async () => {
      const res = await getMyArtistProfileReq(); // get 요청 실행
      const { status, message, data } = res.data;

      if (status !== "success") throw new Error(message || "조회 실패");
      return data ?? null; // null도 정상
    },
  });
}
