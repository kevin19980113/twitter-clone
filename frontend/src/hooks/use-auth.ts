import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "./use-store";
import { useShallow } from "zustand/react/shallow";
import { loginSchemaType, signupSchemaType } from "../lib/schema";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { User } from "../types/userType";
import { useCallback } from "react";

export const REFRESH_THRESHOLD = 5 * 60 * 1000;

type LoginMutationResult = {
  username: string;
  accessToken: string;
};
type logoutMutationResult = {
  username: string;
};
type signupMutationVariableType = signupSchemaType;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/refresh", {
      credentials: "include", // In order to include HTTP-only cookie
    });

    if (!response.ok) throw new Error();

    const data = await response.json();

    return data.accessToken;
  } catch (error) {
    return null;
  }
};
const isAccessTokenExpired = (token: string) => {
  const decoded = jwtDecode(token);
  if (!decoded || typeof decoded.exp !== "number") return token;

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  if (expirationTime - currentTime < REFRESH_THRESHOLD) return true;

  return false;
};
export const isRefreshTokenExpired = async (): Promise<boolean> => {
  const response = await fetch("/api/auth/refresh", {
    credentials: "include",
  });

  const data = await response.json();

  if (data.error === "NO TOKEN") return true;

  return false;
};

export const useAuth = (): {
  login: UseMutationResult<LoginMutationResult, Error, loginSchemaType>;
  signup: UseMutationResult<void, Error, signupMutationVariableType>;
  logout: UseMutationResult<logoutMutationResult, Error, void>;
  getAuthUser: UseQueryResult<User, Error>;
  setAccessTokenAsync: (token: string | null) => Promise<void>;
} => {
  const queryClient = useQueryClient();

  const { accessToken, setAccessToken } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
    }))
  );

  const setAccessTokenAsync = useCallback(
    (token: string | null): Promise<void> => {
      return new Promise((resolve) => {
        setAccessToken(token);
        setTimeout(() => resolve(), 0);
      });
    },
    [setAccessToken]
  );

  const login = useMutation({
    mutationFn: async ({ username, password }: loginSchemaType) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to log in. Please try again.");

      return data;
    },
    onSuccess: async (data: { accessToken: string; username: string }) => {
      await setAccessTokenAsync(data.accessToken); // Store Access Token in state
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(`Welcome back "${data.username}"`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const signup = useMutation({
    mutationFn: async ({
      email,
      username,
      fullName,
      password,
    }: signupMutationVariableType) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, fullName, password }),
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(
          data.error || "Failed to create account. Please try again."
        );
    },
    onSuccess: () => {
      toast.success("Account created successfully. You can now login.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 204) return null; //expired refresh token

      if (!response.ok) throw new Error();

      const data = await response.json();
      return data;
    },
    onSuccess: async (data: { username: string }) => {
      await setAccessTokenAsync(null);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if (data)
        return toast.success(`"${data.username}" Logged out successfully. `);

      toast.error("Your session has expired. Please log in again.");
    },
    onError: (error) => {
      toast.error(`Failed log out. Please try again. ${error}`);
    },
  });

  const getAuthUser = useQuery({
    queryKey: ["authUser"], // when accessToken changes, refetch the data
    queryFn: async () => {
      let latestAccessToken = accessToken;

      if (!latestAccessToken) {
        // when access token is gone from memory(when user refreshes page, etc...)
        latestAccessToken = await refreshAccessToken();

        if (!latestAccessToken) return null; // unauthorized user

        await setAccessTokenAsync(latestAccessToken);
      } else if (isAccessTokenExpired(latestAccessToken)) {
        // if access token is expired, refresh it
        latestAccessToken = await refreshAccessToken();

        if (!latestAccessToken) return null; // unauthorized user

        await setAccessTokenAsync(latestAccessToken);
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${latestAccessToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) throw new Error("something went wrong.");

      return data;
    },
    refetchInterval: REFRESH_THRESHOLD,
    staleTime: REFRESH_THRESHOLD,
    retry: false,
  });

  return { login, signup, logout, getAuthUser, setAccessTokenAsync };
};
