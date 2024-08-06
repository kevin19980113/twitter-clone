import { useState, Fragment } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState<"FOR YOU" | "FOLLOWING">("FOR YOU");

  return (
    <Fragment>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("FOR YOU")}
          >
            For you
            {feedType === "FOR YOU" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType("FOLLOWING")}
          >
            Following
            {feedType === "FOLLOWING" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        <CreatePost />
        <Posts feedType={feedType} />
      </div>
    </Fragment>
  );
};
export default HomePage;
