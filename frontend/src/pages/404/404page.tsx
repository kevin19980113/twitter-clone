import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex-[4_4_0] mr-auto border-gray-700 min-h-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="hover:underline btn btn-primary rounded-lg">
          Go back to home page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
