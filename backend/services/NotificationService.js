import notificationRepository from '../repositories/NotificationRepository.js';

class NotificationService {
  async getUserNotifications(userId) {
    const notifications = await notificationRepository.findByUser(userId, { limit: 20 });
    const unreadCount = await notificationRepository.countUnread(userId);
    return { notifications, unreadCount };
  }

  async createNotification(data) {
    return await notificationRepository.create(data);
  }

  async markAsRead(id, userId) {
    return await notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId) {
    return await notificationRepository.markAllAsRead(userId);
  }
}

export default new NotificationService();
