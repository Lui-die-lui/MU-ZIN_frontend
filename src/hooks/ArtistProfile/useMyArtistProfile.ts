// 제출 안하고 저장 시 신청서 초기 값 세팅
// 서버에서 가져온 데이터 관리(서버 데이터 동기화)
import { useQuery } from "@tanstack/react-query";
import { getMyArtistProfileReq } from "../../apis/artist/artistApi";
import { usePrincipalState } from "../../stores/usePrincipalState";

// 심사 상태(PENDING -> APPROVED/REJECTED)는 관리자가 바꾸므로 캐시(기본 3분)를 쓰지 않고 화면에 들어올 때마다 새로 받음
// 받은 상태가 로그인 정보와 다르면 로그인 정보도 맞춤 (사이드 메뉴·상단 메뉴가 새로고침 없이 바뀌게)
export function useMyArtistProfile() {
  return useQuery({
    queryKey: ["myArtistProfile"],
    queryFn: async () => {
      const res = await getMyArtistProfileReq(); // get 요청 실행
      const { status, message, data } = res.data;

      if (status !== "success") throw new Error(message || "조회 실패");

      const { principal, updatePrincipal } = usePrincipalState.getState();
      if (data?.status && principal && principal.artistStatus !== data.status) {
        updatePrincipal({ artistStatus: data.status });
      }
      return data ?? null; // null도 정상
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
}
