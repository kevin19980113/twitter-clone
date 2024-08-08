import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { Fragment, useEffect } from "react";
import { usePost } from "../../hooks/use-post";

export const getPostEndPoint = (
  feedType: "FOR YOU" | "FOLLOWING" | "POSTS" | "LIKES",
  username?: string,
  userId?: string
) => {
  switch (feedType) {
    case "FOR YOU":
      return "/api/posts/all";
    case "FOLLOWING":
      return "/api/posts/following";
    case "POSTS":
      return `/api/posts/user/${username}`;
    case "LIKES":
      return `/api/posts/likes/${userId}`;
    default:
      return "/api/posts/all";
  }
};
const Posts = ({
  feedType,
  username,
  userId,
}: {
  feedType: "FOR YOU" | "FOLLOWING" | "POSTS" | "LIKES";
  username?: string;
  userId?: string;
}) => {
  const POST_ENDPOINT = getPostEndPoint(feedType, username, userId);
  const { getAllPosts } = usePost();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = getAllPosts(POST_ENDPOINT);

  useEffect(() => {
    refetch();
  }, [refetch, posts, username, POST_ENDPOINT]);

  return (
    <Fragment>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No postposts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </Fragment>
  );
};
export default Posts;
