import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { usePost } from "../../hooks/use-post";
import LoadingSpinner from "./LoadingSpinner";
import { PostType } from "../../types/postType";
import { useForm } from "react-hook-form";
import { createCommentSchema, createCommentSchemaType } from "../../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }: { post: PostType }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<createCommentSchemaType>({
    resolver: zodResolver(createCommentSchema),
  });
  const { getAuthUser } = useAuth();
  const { data: authUser } = getAuthUser;

  const { deletePost, likePost, commentOnPost } = usePost();
  const { mutate: deletePostMutate, isPending: isDeleting } = deletePost;
  const { mutate: likePostMutate, isPending: isLiking } = likePost;
  const { mutate: commentOnPostMutate, isPending: isCommenting } =
    commentOnPost;

  const postOwner = post.user;
  const isLiked = post.likes.some((like) => {
    return like._id === authUser?._id;
  });
  const isMyPost = authUser?._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = () => {
    deletePostMutate({ post });
  };

  const handlePostComment = (createCommentData: createCommentSchemaType) => {
    if (isCommenting) return;
    commentOnPostMutate(
      { post, text: createCommentData.text },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePostMutate({ post });
  };

  return (
    <Fragment>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="size-8 rounded-full overflow-hidden"
          >
            <img
              src={postOwner.profileImg || "/avatar-placeholder.png"}
              alt={postOwner.username}
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {isDeleting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden mt-2">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt={post.text}
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  (
                    document.getElementById(
                      `comments_modal${post._id}`
                    ) as HTMLDialogElement
                  ).showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>

              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="size-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                "/avatar-placeholder.png"
                              }
                              alt={comment.user.username}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handleSubmit(handlePostComment)}
                  >
                    <div className="flex flex-col gap-2 items-start flex-1">
                      <textarea
                        {...register("text")}
                        className="textarea w-full py-1 px-2 rounded text-md resize-none border focus:outline-none  border-gray-800"
                        placeholder="Add a comment..."
                      />
                      {errors.text && (
                        <div className="text-red-500 text-xs">
                          {errors.text.message}
                        </div>
                      )}
                    </div>
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? "Posting..." : "Post"}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none" aria-label="close" />
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                <Fragment>
                  <FaRegHeart
                    className={`w-4 h-4  group-hover:text-red-500 ${
                      isLiked ? "text-red-500" : "text-slate-500"
                    }`}
                  />
                  <span
                    className={`text-sm  group-hover:text-pink-500 ${
                      isLiked ? "text-pink-500" : "text-slate-500"
                    }`}
                  >
                    {post.likes.length}
                  </span>
                </Fragment>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer hover:text-primary" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Post;
