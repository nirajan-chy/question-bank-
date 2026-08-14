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
  hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAdmin: false,
      hasHydrated: false,
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
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "sandarbh-auth",
      partialize: (state) => ({ token: state.token, user: state.user, isAdmin: state.isAdmin }),
      onRehydrateStorage: () => (state) => {
        // With localStorage, persist hydrates synchronously during store
        // creation — but the module-level setAuthToken call below runs before
        // the middleware's storage read. Re-sync the http module's token once
        // the persisted session is restored so refresh keeps you signed in.
        if (state) {
          state.setHasHydrated(true);
          setAuthToken(state.token ?? null);
          if (state.user) syncAuthUser(state.user);
        }
      },
    }
  )
);

// Initial sync for the non-persisted http module (no-op before hydration; the
// onRehydrateStorage callback above applies the real value afterwards).
setAuthToken(useAuthStore.getState().token ?? null);
