import { Link } from "react-router-dom";
import { Fragment, useState } from "react";
import { FaRegComment, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useNotification } from "../../hooks/use-notification";
import { formatPostDate } from "../../utils/date";

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
            disabled={isDeletingAll}
          >
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </button>
        </div>
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
                  <div className="size-8 rounded-full">
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
                <span className="text-sm text-slate-500">
                  {formatPostDate(notification.createdAt)}
                </span>
              </Link>
              <button
                className="btn btn-primary btn-sm rounded-md ml-auto"
                onClick={() => handleDeleteNotification(notification._id)}
                disabled={
                  isDeleting && DeletingNotification === notification._id
                }
              >
                {isDeleting && DeletingNotification === notification._id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
export default NotificationPage;
