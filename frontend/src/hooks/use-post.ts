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
import { createPostSchemaType } from "../lib/schema";

type deletePostVariableType = { postId: string };
type createPostMutationType = createPostSchemaType & { reset: () => void };

export const usePost = (): {
  getAllPosts: (POST_ENDPOINT: string) => UseQueryResult<any, Error>;
  deletePost: UseMutationResult<void, Error, deletePostVariableType>;
  createPost: UseMutationResult<void, Error, createPostMutationType>;
} => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );
  const queryClient = useQueryClient();

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

  const deletePost = useMutation({
    mutationFn: async ({ postId }: deletePostVariableType) => {
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

  const createPost = useMutation({
    mutationFn: async ({ text, img, reset }: createPostMutationType) => {
      const res = await fetch(`/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text, img }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.error || "Failed to create post. Please try again."
        );
      return data;
    },
    onSuccess: (_, { reset }) => {
      toast.success("Post created successfully.");
      reset();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { getAllPosts, deletePost, createPost };
};
