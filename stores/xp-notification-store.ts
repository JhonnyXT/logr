import { create } from "zustand";
import type { XpSource } from "@/types/gamification";

interface XpNotification {
  id: string;
  amount: number;
  source: XpSource;
  message: string;
  levelUp?: number;
}

interface XpNotificationState {
  notifications: XpNotification[];
  addNotification: (notification: Omit<XpNotification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

let notifCounter = 0;

export const useXpNotificationStore = create<XpNotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `xp-${++notifCounter}-${Date.now()}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));
