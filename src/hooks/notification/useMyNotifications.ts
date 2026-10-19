import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "./notificationKeys";
import { getMyNotificationsReq } from "../../apis/notification/notificationApis";
import type { NotificationResponse } from "../../Types/notificationTypes";

type Params = {
  enabled?: boolean;
};

export const useMyNotifications = ({ enabled = true }: Params) =>
  useQuery<NotificationResponse[]>({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const resp = await getMyNotificationsReq();
      return Array.isArray(resp.data.data) ? resp.data.data : [];
    },
    // initialData 로 [] 를 주면 "방금 받은 데이터"로 취급돼 기본 staleTime(3분) 동안 실제 요청을 안 함
    // -> 화면용 기본값만 (캐시엔 안 들어감)
    placeholderData: [],
    enabled,
  });
