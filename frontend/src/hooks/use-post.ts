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
import { PostType, like } from "../types/postType";

type mutatePostVariableType = {
  post: PostType;
  text?: string;
};
type createPostMutationType = createPostSchemaType & {
  img: string | null;
};
type mutateLikeResultType = {
  updatedLikes: like[];
};
type mutateCommentResultType = {
  updatedComments: Comment[];
};

export const usePost = (): {
  getAllPosts: (POST_ENDPOINT: string) => UseQueryResult<PostType[], Error>;
  deletePost: UseMutationResult<void, Error, mutatePostVariableType>;
  createPost: UseMutationResult<void, Error, createPostMutationType>;
  likePost: UseMutationResult<
    mutateLikeResultType,
    Error,
    mutatePostVariableType
  >;
  commentOnPost: UseMutationResult<
    mutateCommentResultType,
    Error,
    mutatePostVariableType
  >;
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
    mutationFn: async ({ post }: mutatePostVariableType) => {
      const res = await fetch(`/api/posts/delete/${post._id}`, {
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
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ text, img }: createPostMutationType) => {
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
    },
    onSuccess: () => {
      toast.success("Post created successfully.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const likePost = useMutation({
    mutationFn: async ({ post }: mutatePostVariableType) => {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      return data;
    },
    onSuccess: (data: mutateLikeResultType, { post }) => {
      //update cache directly for this specific post (invalidate X)
      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            const updatedLikes = data.updatedLikes.map((userId) => ({
              _id: userId,
            }));
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const commentOnPost = useMutation({
    mutationFn: async ({ post, text }: mutatePostVariableType) => {
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to comment.");

      return data;
    },
    onSuccess: (data: mutateCommentResultType, { post }) => {
      queryClient.setQueryData(["posts"], (oldData: PostType[]) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, comments: data.updatedComments };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { getAllPosts, deletePost, createPost, likePost, commentOnPost };
};
