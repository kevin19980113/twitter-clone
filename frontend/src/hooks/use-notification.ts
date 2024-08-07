import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "./use-store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { Notifications } from "../types/notificationsType";

type deleteNotificationVariableType = { notificationId: string };
type deleteNotificationResultType = {
  updatedNotifications: Notifications[];
};
export const useNotification = (): {
  getNotifications: UseQueryResult<Notifications[], Error>;
  deleteAllNotifications: UseMutationResult<void, Error, void>;
  deletenotification: UseMutationResult<
    deleteNotificationResultType,
    Error,
    deleteNotificationVariableType
  >;
} => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );
  const queryClient = useQueryClient();

  const getNotifications = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "something went wrong");

        return data;
      } catch (error) {
        toast.error("Failed to load notifications. Please try again later.");
      }
    },
  });

  const deleteAllNotifications = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deletenotification = useMutation({
    mutationFn: async ({ notificationId }: deleteNotificationVariableType) => {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "something went wrong");

      return data;
    },
    onSuccess: (data: { updatedNotifications: Notifications[] }) => {
      queryClient.setQueryData(["notifications"], () => {
        return data.updatedNotifications || [];
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { getNotifications, deleteAllNotifications, deletenotification };
};
