import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.tsx";
import { Fragment, useState } from "react";
import { useFollow } from "../../hooks/use-follow.ts";
import { useSuggest } from "../../hooks/use-suggest.ts";

const RightPanel = () => {
  const [followingUserId, setFollowingUserId] = useState<string | null>(null);
  const { follow } = useFollow();
  const { mutate: followMutate } = follow;

  const { suggestUsers } = useSuggest();
  const { data: suggestedUsers, isLoading } = suggestUsers;

  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0" />;

  const handleFollowingUser = (userId: string) => {
    setFollowingUserId(userId);
    followMutate(
      { userId: userId },
      { onSettled: () => setFollowingUserId(null) }
    );
  };

  return (
    <div className="hidden lg:block m-4 w-[300px]">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold mb-4">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <Fragment>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </Fragment>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="size-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500 truncate w-28">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFollowingUser(user._id);
                    }}
                    disabled={followingUserId === user._id}
                  >
                    {followingUserId === user._id ? "Following..." : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
