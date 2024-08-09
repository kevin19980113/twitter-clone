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
import { User } from "../types/userType";
import { editProfileSchemaType } from "../lib/schema";

type updateProfileVariableType = editProfileSchemaType & {
  profileImg?: string | null;
  coverImg?: string | null;
};

export const useUser = (): {
  getUserProfile: (username: string | undefined) => UseQueryResult<User, Error>;
  updateProfile: UseMutationResult<void, Error, updateProfileVariableType>;
} => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({ accessToken: state.accessToken }))
  );
  const queryClient = useQueryClient();

  const getUserProfile = (username: string | undefined) =>
    useQuery({
      queryKey: ["userProfile", username],
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

  // TODO: Error controls
  const updateProfile = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (newProfile: updateProfileVariableType) => {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProfile),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
    },
    onSuccess: (_, { username }) => {
      toast.success("Profile updated successfully.");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile", username] }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { getUserProfile, updateProfile };
};
