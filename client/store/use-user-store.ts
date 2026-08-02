"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookmarkItem } from "@/types";

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
  name: "Sujan Adhikari",
  username: "sujanadhikari",
  email: "sujan@example.com",
  level: "SEE · Class 10",
  faculty: "Science",
  college: "Galaxy Public School",
  city: "Kathmandu",
  streak: 21,
  xp: 4860,
  badges: ["Early Bird", "Question Solver", "10-Day Streak"],
  bio: "SEE aspirant aiming for GPA 4.0. Science & maths enthusiast, community helper.",
};

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
      bookmarks: [
        {
          id: "n3",
          type: "note",
          title: "Class 11 Physics — Mechanics Notes (Unit 1)",
          subtitle: "NEB · Class 11 · by Bikash Thapa",
          href: "/subjects/physics?tab=notes",
          savedAt: "2026-07-01",
          icon: "note",
        },
        {
          id: "q1",
          type: "question-bank",
          title: "SEE Mathematics — Full Syllabus Question Bank 2082",
          subtitle: "SEE · Class 10 · 420 questions",
          href: "/question-banks",
          savedAt: "2026-06-28",
          icon: "question-bank",
        },
      ],
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
