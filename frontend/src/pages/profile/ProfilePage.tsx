import { ChangeEvent, useRef, useState, Fragment, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Posts, { getPostEndPoint } from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useUser } from "../../hooks/use-user";
import { formatMemberSinceDate } from "../../utils/date";
import { useAuth } from "../../hooks/use-auth";
import { usePost } from "../../hooks/use-post";
import { useFollow } from "../../hooks/use-follow";

const ProfilePage = () => {
  const [newCoverImg, setNewCoverImg] = useState<string | null>(null);
  const [newProfileImg, setNewProfileImg] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<"POSTS" | "LIKES">("POSTS");

  const coverImgRef = useRef<HTMLInputElement | null>(null);
  const profileImgRef = useRef<HTMLInputElement | null>(null);

  const { username } = useParams();
  const { getAuthUser } = useAuth();
  const { data: authUser } = getAuthUser;
  const { getUserProfile, updateProfile } = useUser();
  const { follow } = useFollow();
  const { mutate: followMutate, isPending: isFollowing } = follow;
  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = getUserProfile(username);
  const { mutate: updateProfileMutate, isPending: isUpdating } = updateProfile;
  const isMyProfile = username === authUser?.username;
  const { getAllPosts } = usePost();

  const POST_ENDPOINT = getPostEndPoint(feedType, username, user?._id);
  const { data: posts } = getAllPosts(POST_ENDPOINT);

  const handleFollowingUser = (userId: string) => {
    followMutate({ userId: userId });
  };

  const isFollowed = authUser?.following.some(
    (followedUserId) => followedUserId === user?._id
  );

  useEffect(() => {
    return () => {
      setNewCoverImg(null);
      setNewProfileImg(null);
    };
  }, [username]);

  useEffect(() => {
    refetch();
  }, [authUser, username, refetch]);

  const handleImgChange = (
    e: ChangeEvent<HTMLInputElement>,
    state: "coverImg" | "profileImg"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        state === "coverImg" &&
          typeof event.target?.result === "string" &&
          setNewCoverImg(event.target.result);
        state === "profileImg" &&
          typeof event.target?.result === "string" &&
          setNewProfileImg(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpdate = async () => {
    updateProfileMutate(
      {
        fullName: authUser!.fullName,
        username: authUser!.username,
        email: authUser!.email,
        currentPassword: "",
        newPassword: "",
        bio: authUser?.bio,
        link: authUser?.link,
        coverImg: newCoverImg,
        profileImg: newProfileImg,
      },
      {
        onSuccess: () => {
          setNewCoverImg(null);
          setNewProfileImg(null);
        },
      }
    );
  };

  return (
    <Fragment>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <Fragment>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4 hover:text-primary" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {posts?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={newCoverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current?.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white hover:text-primary" />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />

                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="size-32 rounded-full relative group/avatar">
                    <img
                      src={
                        newProfileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                    {isMyProfile && (
                      <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                        <MdEdit
                          className="w-4 h-4 text-white hover:text-sky-300"
                          onClick={() => profileImgRef.current?.click()}
                        />

                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={profileImgRef}
                          onChange={(e) => handleImgChange(e, "profileImg")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => handleFollowingUser(user._id)}
                    disabled={isFollowing}
                  >
                    {isFollowing && "Loading..."}
                    {!isFollowing && (isFollowed ? "Unfollow" : "Follow")}
                  </button>
                )}
                {(newCoverImg || newProfileImg) && isMyProfile && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => handleImageUpdate()}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <Fragment>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={user?.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user.link}
                        </a>
                      </Fragment>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {formatMemberSinceDate(user?.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("POSTS")}
                >
                  Posts
                  {feedType === "POSTS" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("LIKES")}
                >
                  Likes
                  {feedType === "LIKES" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </Fragment>
          )}

          <Posts username={username} userId={user?._id} feedType={feedType} />
        </div>
      </div>
    </Fragment>
  );
};
export default ProfilePage;
