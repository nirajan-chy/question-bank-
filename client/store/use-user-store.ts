"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookmarkItem, User } from "@/types";

export type MockUser = {
  name: string;
  username: string;
  email: string;
  level: string;
  faculty: string;
  college: string;
  city: string;
  streak: number;
  xp: number;
  badges: string[];
  bio: string;
};

const defaultUser: MockUser = {
  name: "Student",
  username: "student",
  email: "",
  level: "SEE · Class 10",
  faculty: "Science",
  college: "",
  city: "Kathmandu",
  streak: 0,
  xp: 0,
  badges: [],
  bio: "",
};

/** Sync real auth user data into the local user store (name, email, etc.) */
export function syncAuthUser(authUser: User | null) {
  if (!authUser) return;
  const store = useUserStore.getState();
  const current = store.user;
  store.setUser({
    name: authUser.name || current.name,
    username: authUser.name?.split(" ")[0]?.toLowerCase() || current.username,
    email: authUser.email || current.email,
    bio: authUser.bio || current.bio,
  });
}

type UserState = {
  user: MockUser;
  bookmarks: BookmarkItem[];
  setUser: (partial: Partial<MockUser>) => void;
  addBookmark: (item: BookmarkItem) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (item: BookmarkItem) => void;
  isBookmarked: (id: string) => boolean;
  incrementStreak: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      bookmarks: [],
      setUser: (partial) => set((s) => ({ user: { ...s.user, ...partial } })),
      addBookmark: (item) =>
        set((s) => ({ bookmarks: [item, ...s.bookmarks.filter((b) => b.id !== item.id)] })),
      removeBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      toggleBookmark: (item) => {
        const { bookmarks, addBookmark, removeBookmark } = get();
        if (bookmarks.some((b) => b.id === item.id)) removeBookmark(item.id);
        else addBookmark(item);
      },
      isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),
      incrementStreak: () =>
        set((s) => ({ user: { ...s.user, streak: s.user.streak + 1, xp: s.user.xp + 50 } })),
    }),
    { name: "sandarbh-user" }
  )
);
