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
      //   const resp = await getMyNotificationsReq();
      //   return resp.data.data;
      // },
      const resp = await getMyNotificationsReq();
      return Array.isArray(resp.data.data) ? resp.data.data : [];
    },
    initialData: [],
    enabled,
  });
