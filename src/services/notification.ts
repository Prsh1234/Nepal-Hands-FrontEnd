import api from "@/lib/api";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const getNotifications = async () => {
  const res = await api.get<Notification[]>("/notifications/all");
  return res.data;
};

export const markNotificationRead = async (id: number) => {
  await api.put(`/notifications/mark-read/${id}`);
};

export const markAllNotificationsRead = async () => {
  await api.put("/notifications/mark-all-read");
};

export const clearNotifications = async () => {
  await api.delete("/notifications/clear");
};

export const deleteNotification = async (id: number) => {
  await api.delete(`/notifications/${id}`);
};