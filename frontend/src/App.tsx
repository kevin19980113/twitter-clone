import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster, toast } from "sonner";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { isRefreshTokenExpired, useAuth } from "./hooks/use-auth";
import { useEffect } from "react";

function App() {
  const { getAuthUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRefreshToken = async () => {
      if (getAuthUser.data) {
        const isExpired = await isRefreshTokenExpired();
        if (isExpired) {
          logout.mutate();
          navigate("/login");
          toast.error("Your session has expired. Please log in again.");
        }
      }
    };

    const intervalId = setInterval(checkRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [getAuthUser.data, isRefreshTokenExpired, navigate]);

  if (getAuthUser.isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (getAuthUser.isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-center text-2xl text-red-500">
          An error occurred. Please Try Again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {getAuthUser.data && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={getAuthUser.data ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!getAuthUser.data ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!getAuthUser.data ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={
            getAuthUser.data ? <NotificationPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile/:username"
          element={
            getAuthUser.data ? <ProfilePage /> : <Navigate to="/login" />
          }
        />
      </Routes>
      {getAuthUser.data && <RightPanel />}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
