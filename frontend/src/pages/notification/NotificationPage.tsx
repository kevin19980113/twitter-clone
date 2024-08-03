import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Fragment } from "react";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
  const isLoading = false;
  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "like",
    },
  ];

  const deleteNotifications = () => {
    alert("All notifications deleted");
  };

  return (
    <Fragment>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <button
            className="btn btn-primary btn-sm rounded-md"
            onClick={() => deleteNotifications()}
          >
            Delete All
          </button>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="xl" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notification.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
export default NotificationPage;
