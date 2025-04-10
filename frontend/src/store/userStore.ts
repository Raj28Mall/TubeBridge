import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  picture: string;
  role: "admin" | "content-manager";
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null, 
      setUser: (user) => set({ user }), 
      logout: () => set({ user: null }), 
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage, 
    }
  )
);
