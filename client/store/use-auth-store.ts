"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { setAuthToken } from "@/services/http";
import { syncAuthUser } from "./use-user-store";

type AuthState = {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAdmin: false,
      setAuth: (token, user) => {
        setAuthToken(token);
        set({ token, user, isAdmin: user.role === "admin" });
        syncAuthUser(user);
      },
      setUser: (user) => {
        set({ user, isAdmin: user.role === "admin" });
        syncAuthUser(user);
      },
      logout: () => {
        setAuthToken(null);
        set({ token: null, user: null, isAdmin: false });
      },
    }),
    { name: "sandarbh-auth" }
  )
);

setAuthToken(useAuthStore.getState().token ?? null);
syncAuthUser(useAuthStore.getState().user);
