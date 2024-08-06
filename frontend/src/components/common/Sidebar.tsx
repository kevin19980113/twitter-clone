import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../hooks/use-store";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "../../hooks/use-auth";
import { User } from "../../types/userType";

const Sidebar = () => {
  const { accessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
    }))
  );

  const { logout } = useAuth();
  const { mutate: logoutMutate } = logout;

  const { data: authUser } = useQuery<User | null>({
    queryKey: ["authUser", accessToken],
  });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full p-4">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="p-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 p-2 md:py-2 md:px-3 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="size-6" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 p-2 md:py-2 md:px-3 max-w-fit cursor-pointer"
            >
              <IoNotifications className="size-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 p-2 md:py-2 md:px-3 max-w-fit cursor-pointer"
            >
              <FaUser className="size-5 ml-px" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto flex gap-2 items-center transition-all duration-300 hover:bg-[#181818] p-3 rounded-full"
          >
            <div className="avatar hidden md:flex items-center justify-center">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex items-center justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="size-5 cursor-pointer hover:text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  logoutMutate();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
