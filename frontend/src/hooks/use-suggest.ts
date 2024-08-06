import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "./use-store";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { User } from "../types/userType";

export const useSuggest = (): {
  suggestUsers: UseQueryResult<User[], Error>;
} => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );
  const suggestUsers = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error();
        return data;
      } catch (error) {
        toast.error("Failed to load suggested users. Please try again later.");
      }
    },
  });

  return { suggestUsers };
};
