import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { Fragment } from "react";

const Posts = () => {
  const isLoading = false;

  return (
    <Fragment>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && POSTS && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </Fragment>
  );
};
export default Posts;
