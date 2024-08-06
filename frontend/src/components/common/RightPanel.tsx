import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.tsx";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "../../hooks/use-store.ts";
import { useShallow } from "zustand/react/shallow";

const RightPanel = () => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );

  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error();
        return data;
      } catch (error) {
        toast.error("Failed to load suggested users. Please try again later.");
      }
    },
  });

  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0" />;

  return (
    <div className="hidden lg:block m-4">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold mb-4">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user: any) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => e.preventDefault()}
                  >
                    Follow
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
