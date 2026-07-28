import notificationService from '../services/NotificationService.js';

class NotificationController {
  async getUserNotifications(req, res, next) {
    try {
      const result = await notificationService.getUserNotifications(req.user.id);
      return res.status(200).json({
        success: true,
        data: result.notifications,
        unreadCount: result.unreadCount
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const updated = await notificationService.markAsRead(req.params.id, req.user.id);
      return res.status(200).json({
        success: true,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user.id);
      return res.status(200).json({
        success: true,
        message: 'All notifications marked as read.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
