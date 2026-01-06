import { useQuery } from "@tanstack/react-query";
import { getPublicLessonDetailReq } from "../apis/lesson/lessonSearchApis";

export const usePublicLessonDetail = (lessonId: number) =>
  useQuery({
    queryKey: ["lessonDetail", lessonId], // 캐시 자체의 이름표
    queryFn: async () => (await getPublicLessonDetailReq(lessonId)).data.data, 
    // 진짜 데이터를 가져옴 AxiosResponse -> { data: ApiRespDto -> { data: 진짜데이터 } }
    enabled: Number.isInteger(lessonId) && lessonId > 0, // 레슨 아이디가 정수 양수일때만 허용
  })