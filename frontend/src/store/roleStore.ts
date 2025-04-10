import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RoleStore {
  role: "admin" | "content-manager";
  setRole: (role: "admin" | "content-manager") => void;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      role: "admin", 
      setRole: (role) => set({ role }),
    }),
    {
      name: "role-storage", 
      getStorage: () => localStorage, 
    }
  )
);
