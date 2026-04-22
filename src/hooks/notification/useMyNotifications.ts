import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "./notificationKeys";
import { getMyNotificationsReq } from "../../apis/notification/notificationApis";
import type { NotificationResponse } from "../../Types/notificationTypes";

export const useMyNotifications = () =>
  useQuery<NotificationResponse[]>({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const resp = await getMyNotificationsReq();
      return resp.data.data;
    },
  });
