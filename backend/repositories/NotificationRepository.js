import Notification from '../models/Notification.js';

class NotificationRepository {
  async findByUser(userId, { limit = 20 }) {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async countUnread(userId) {
    return await Notification.countDocuments({ userId, isRead: false });
  }

  async create(notificationData) {
    return await Notification.create(notificationData);
  }

  async markAsRead(id, userId) {
    return await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    ).exec();
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany({ userId, isRead: false }, { isRead: true }).exec();
  }
}

export default new NotificationRepository();
