import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "./use-store";
import { useShallow } from "zustand/react/shallow";
import { User } from "../types/userType";
import { toast } from "sonner";

type FollowVariableType = { userId: string };

export const useFollow = (): {
  follow: UseMutationResult<User, Error, FollowVariableType>;
} => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );

  const follow = useMutation({
    mutationFn: async ({ userId }: FollowVariableType) => {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to follow user.");

      return data as User;
    },
    onSuccess: (data, _) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
      ]);
      toast.success(`"${data.username}" followed successfully"`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { follow };
};
