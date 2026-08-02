"use client";

import { create } from "zustand";

type UiState = {
  commandOpen: boolean;
  widgetOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;
  setWidgetOpen: (open: boolean) => void;
  toggleWidget: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandOpen: false,
  widgetOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  setWidgetOpen: (widgetOpen) => set({ widgetOpen }),
  toggleWidget: () => set((s) => ({ widgetOpen: !s.widgetOpen })),
}));
