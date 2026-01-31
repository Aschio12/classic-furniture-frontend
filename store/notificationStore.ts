import { create } from "zustand";

export type NotificationItem = {
  id: string;
  type: "Payout" | "Arrival" | "System" | string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationState = {
  notifications: NotificationItem[];
  unreadCount: number;
  setNotifications: (items: NotificationItem[]) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (items) =>
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.isRead).length,
    }),
  markAllRead: () =>
    set({
      notifications: get().notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
