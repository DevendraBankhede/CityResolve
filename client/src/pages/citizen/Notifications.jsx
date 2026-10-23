import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Clock,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  Info,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { notificationService } from "../../services/notificationService";
import { formatDate, formatDateTime } from "../../utils/helpers";
import toast from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' or 'unread'

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      } else {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notification marked as read");
    } catch {
      toast.error("Could not mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadList = notifications.filter((n) => !n.isRead);
      if (unreadList.length === 0) {
        toast("No unread notifications", { icon: "ℹ️" });
        return;
      }

      for (const item of unreadList) {
        await notificationService.markAsRead(item._id);
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read!");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const displayedNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const getNotificationIcon = (title = "") => {
    const lower = title.toLowerCase();
    if (lower.includes("resolved") || lower.includes("completed")) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
    if (lower.includes("progress") || lower.includes("updated")) {
      return <Clock className="w-5 h-5 text-amber-500" />;
    }
    if (lower.includes("alert") || lower.includes("urgent")) {
      return <AlertTriangle className="w-5 h-5 text-rose-500" />;
    }
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex-1 flex w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Stay updated on your reported civic issues and city service notices.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchNotifications}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
                title="Refresh Notifications"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  <CheckCheck className="w-4 h-4 text-blue-600" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filter === "unread"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          {loading ? (
            <Loader text="Loading your notifications..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchNotifications} />
          ) : displayedNotifications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filter === "unread"
                  ? "You are all caught up! You have read all notifications."
                  : "When your reported issues are acknowledged, scheduled, or resolved, updates will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    notif.isRead
                      ? "bg-white border-slate-200"
                      : "bg-blue-50/40 border-blue-200/80 shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/70 flex items-center justify-center shrink-0 shadow-xs">
                    {getNotificationIcon(notif.title)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4
                        className={`text-sm truncate ${
                          notif.isRead ? "font-bold text-slate-800" : "font-extrabold text-slate-900"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        {notif.createdAt ? formatDateTime(notif.createdAt) : "Just now"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-100">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark as read
                        </button>
                      )}

                      <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 ml-auto"
                      >
                        Go to dashboard
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Notifications;
