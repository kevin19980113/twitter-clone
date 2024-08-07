import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./use-store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { User } from "../types/userType";

export const useUser = (): {
  getUserProfile: (username: string | undefined) => UseQueryResult<User, Error>;
} => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({ accessToken: state.accessToken }))
  );

  const getUserProfile = (username: string | undefined) =>
    useQuery({
      queryKey: ["userProfile"],
      queryFn: async () => {
        try {
          if (!username)
            return toast.error("Username not found. please try again.");

          const res = await fetch(`/api/users/profile/${username}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (!res.ok)
            throw new Error(data.error || "Failed to fetch user profile.");

          return data;
        } catch (error: any) {
          toast.error(error.message);
        }
      },
    });

  return { getUserProfile };
};
