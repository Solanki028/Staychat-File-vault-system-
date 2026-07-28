import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, CheckCheck, Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchNotificationsAsync, markAllReadAsync, markReadAsync } from '../redux/slices/notificationSlice';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { list: notifications, unreadCount } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotificationsAsync());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markReadAsync(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllReadAsync());
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'danger':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center border-2 border-slate-950 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          <div className="p-3 px-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkRead(n._id)}
                  className={`p-3 text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                    !n.isRead ? 'bg-indigo-500/5 hover:bg-indigo-500/10' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`truncate font-semibold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                      <span className="text-[10px] text-slate-500">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">No notifications yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
