import { StateCreator, create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type User = {
  username: string;
  fullName: string;
  profileImg?: string;
  bio?: string;
  link?: string;
};

type storeState = {
  user: User | null;
};

type storeActions = {
  setUser: (user: User | null) => void;
};

type AuthStore = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
};

type storeSlice = storeState & storeActions;

const createStoreSlice: StateCreator<
  storeSlice,
  [["zustand/immer", never], ["zustand/subscribeWithSelector", never]],
  [],
  storeSlice
> = (set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
});

export const useStore = create<storeSlice>()(
  subscribeWithSelector(
    immer((...a) => ({
      ...createStoreSlice(...a),
    }))
  )
);

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));

// useStore.subscribe(
//   (state) => state.user,
//   (user) => {
//     useStore.getState().setUser(user);
//   },
//   {
//     equalityFn: shallow,
//     fireImmediately: true,
//   }
// );
