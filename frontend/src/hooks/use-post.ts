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

export const usePost = (): {
  getAllPosts: (POST_ENDPOINT: string) => UseQueryResult<any, Error>;
  deletePost: (postId: string) => UseMutationResult<void, Error, void>;
} => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );
  const queryClient = useQueryClient();

  const getAllPosts = (POST_ENDPOINT: string) =>
    useQuery<any, Error>({
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

  const deletePost = (postId: string) =>
    useMutation<void, Error, void>({
      mutationFn: async () => {
        const res = await fetch(`/api/posts/delete/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);
      },
      onSuccess: () => {
        toast.success("Post deleted successfully.");
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { getAllPosts, deletePost };
};
