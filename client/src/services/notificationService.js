import api from "../config/api";

// Initial mock notifications for frontend demo and offline mode
let mockNotifications = [
  {
    _id: "1",
    title: "Pothole Report Updated",
    message: "Your reported pothole issue #1042 status changed to 'In Progress'.",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Streetlight Repair Scheduled",
    message: "Maintenance team scheduled for Central Park Ave lighting on Friday.",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Welcome to CityResolve!",
    message: "Explore your dashboard to report civic issues and view real-time city updates.",
    isRead: true,
    createdAt: new Date().toISOString(),
  },
];

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch {
      // Fallback for offline mode or backend offline
      const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
      return {
        success: true,
        data: {
          notifications: [...mockNotifications],
          unreadCount,
        },
      };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch {
      mockNotifications = mockNotifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
      const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
      return {
        success: true,
        data: {
          notifications: [...mockNotifications],
          unreadCount,
        },
      };
    }
  },
};

export default notificationService;
