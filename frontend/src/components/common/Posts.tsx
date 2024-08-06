import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { Fragment, useEffect } from "react";
import { usePost } from "../../hooks/use-post";

const Posts = ({ feedType }: { feedType: "FOR YOU" | "FOLLOWING" }) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case "FOR YOU":
        return "/api/posts/all";
      case "FOLLOWING":
        return "/api/posts/following";
      default:
        return "/api/posts/all";
    }
  };
  const POST_ENDPOINT = getPostEndPoint();
  const { getAllPosts } = usePost();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = getAllPosts(POST_ENDPOINT);

  useEffect(() => {
    refetch();
  }, [feedType]);

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
          {posts.map((post: any) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </Fragment>
  );
};
export default Posts;
