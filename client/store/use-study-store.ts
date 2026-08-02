"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudySession } from "@/types";

type StudyState = {
  sessions: StudySession[];
  pomodoroMinutes: number;
  isRunning: boolean;
  pomodoroMode: "focus" | "break";
  completedPomodoros: number;
  addSession: (session: StudySession) => void;
  setPomodoroMinutes: (minutes: number) => void;
  setRunning: (running: boolean) => void;
  setMode: (mode: "focus" | "break") => void;
  completePomodoro: () => void;
  resetPomodoro: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      sessions: [
        { id: "s1", subject: "Mathematics", subjectEmoji: "📐", date: "2026-07-01", minutes: 45, mode: "Focus" },
        { id: "s2", subject: "Science", subjectEmoji: "🔬", date: "2026-07-02", minutes: 60, mode: "Pomodoro" },
        { id: "s3", subject: "Mathematics", subjectEmoji: "📐", date: "2026-07-03", minutes: 30, mode: "Review" },
        { id: "s4", subject: "English", subjectEmoji: "📖", date: "2026-07-04", minutes: 50, mode: "Focus" },
        { id: "s5", subject: "Computer Science", subjectEmoji: "💻", date: "2026-07-05", minutes: 35, mode: "Pomodoro" },
        { id: "s6", subject: "Science", subjectEmoji: "🔬", date: "2026-07-06", minutes: 40, mode: "Focus" },
      ],
      pomodoroMinutes: 25,
      isRunning: false,
      pomodoroMode: "focus",
      completedPomodoros: 12,
      addSession: (session) =>
        set((s) => ({ sessions: [session, ...s.sessions].slice(0, 60) })),
      setPomodoroMinutes: (pomodoroMinutes) => set({ pomodoroMinutes }),
      setRunning: (isRunning) => set({ isRunning }),
      setMode: (pomodoroMode) => set({ pomodoroMode }),
      completePomodoro: () => {
        const { completedPomodoros, sessions, pomodoroMinutes } = get();
        const session: StudySession = {
          id: `p-${Date.now()}`,
          subject: "Focus Session",
          subjectEmoji: "⏱️",
          date: today(),
          minutes: pomodoroMinutes,
          mode: "Pomodoro",
        };
        set({
          completedPomodoros: completedPomodoros + 1,
          sessions: [session, ...sessions].slice(0, 60),
        });
      },
      resetPomodoro: () => set({ isRunning: false, pomodoroMode: "focus" }),
    }),
    { name: "sandarbh-study" }
  )
);
