import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export const notificationService = {
  markAsRead(notifications, notifId) {
    return notifications.map((n) => {
      if (n.id === notifId) {
        return { ...n, unread: false };
      }
      return n;
    });
  },

  markAllAsRead(notifications) {
    return notifications.map((n) => ({ ...n, unread: false }));
  },

  addNotification(notifications, notifData) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: notifData.type || 'info',
      title: notifData.title || 'Notification',
      content: notifData.content || '',
      link: notifData.link || '/',
      unread: true,
      timestamp: new Date().toISOString(),
      avatar: notifData.avatar || null
    };
    return [newNotif, ...notifications];
  }
};
