import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Fragment, useState } from "react";
import { FaRegComment, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useNotification } from "../../hooks/use-notification";

const NotificationPage = () => {
  const [DeletingNotification, setDeletingNotification] = useState<
    string | null
  >(null);

  const { getNotifications, deleteAllNotifications, deletenotification } =
    useNotification();
  const { data: notifications } = getNotifications;
  const { mutate: deleteAllNotificationsMutate, isPending: isDeletingAll } =
    deleteAllNotifications;
  const { mutate: deleteNotificationMutate, isPending: isDeleting } =
    deletenotification;

  const handleDeleteAllNotifications = () => {
    deleteAllNotificationsMutate();
  };

  const handleDeleteNotification = (notificationId: string) => {
    setDeletingNotification(notificationId);
    deleteNotificationMutate(
      { notificationId },
      {
        onSettled: () => setDeletingNotification(null),
      }
    );
  };

  return (
    <Fragment>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <button
            className="btn btn-primary btn-sm rounded-md"
            onClick={() => handleDeleteAllNotifications()}
          >
            Delete All
          </button>
        </div>
        {isDeletingAll && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "FOLLOW" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "LIKE" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              {notification.type === "COMMENT" && (
                <FaRegComment className="w-7 h-7 text-blue-500" />
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
                  {notification.type === "FOLLOW"
                    ? "followed you"
                    : notification.type === "LIKE"
                    ? "liked your post"
                    : "commented on your post"}
                </div>
              </Link>

              {isDeleting && DeletingNotification === notification._id ? (
                <div className="flex justify-center h-full items-center ml-auto">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-sm rounded-md ml-auto"
                  onClick={() => handleDeleteNotification(notification._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
export default NotificationPage;
