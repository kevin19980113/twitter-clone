import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./use-store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";

export const usePost = (): {
  getAllPosts: (POST_ENDPOINT: string) => UseQueryResult<any, Error>;
} => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );

  const getAllPosts = (POST_ENDPOINT: string) =>
    useQuery({
      queryKey: ["posts"],
      queryFn: async () => {
        try {
          const res = await fetch(POST_ENDPOINT, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await res.json();

          if (!res.ok) throw new Error();

          return data;
        } catch (error) {
          toast.error("Failed to fetch posts. Please try again.");
        }
      },
    });

  return { getAllPosts };
};
