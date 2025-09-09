import realApiService from './realApiService.js';

/**
 * Notification service for managing user notifications
 */

// Get notifications for the current user (real backend if available)
export const getNotifications = async (filters = {}) => {
  try {
    const result = await realApiService.notifications.getAll(filters);
    // The backend returns raw list; adapt to previous structure
    return {
      success: true,
      data: result?.data || result || [],
      error: null
    };
  } catch (error) {
    console.error(
      'Failed to fetch notifications, falling back to mock:',
      error
    );
    return { success: false, data: [], error: error.message };
  }
};

// Create a notification
export const createNotification = async (notificationData) => {
  try {
    const result = await realApiService.notifications.create(notificationData);
    return { success: true, data: result?.data || result, error: null };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const result = await realApiService.notifications.markAsRead(
      notificationId
    );
    return { success: true, data: result?.data || result, error: null };
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const result = await realApiService.notifications.markAllAsRead();
    return { success: true, data: result?.data || result, error: null };
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const result = await realApiService.notifications.delete(notificationId);
    return { success: true, data: result?.data || result, error: null };
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Get notification stats (unread counts)
export const getNotificationStats = async () => {
  try {
    const result = await realApiService.notifications.getStats();
    return { success: true, data: result?.data || result, error: null };
  } catch (error) {
    console.error('Failed to get notification stats:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Create a welcome notification for new users (client-side convenience)
export const createWelcomeNotification = async (
  userId,
  organizationId,
  organizationName
) => {
  try {
    const payload = {
      user_id: userId,
      organization_id: organizationId,
      title: 'Welcome to Agno WorkSphere!',
      message: `Welcome to ${organizationName}! Start by exploring your dashboard and setting up your first project.`,
      type: 'welcome',
      priority: 'high',
      action_url: '/role-based-dashboard',
      notification_metadata: { isWelcome: true },
    };
    return await createNotification(payload);
  } catch (error) {
    console.error('Failed to create welcome notification:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Get notification preferences (keep mock for now)
export const getNotificationPreferences = async () => {
  try {
    // If backend supports preferences endpoint, route via realApiService here
    return {
      success: true,
      data: {
        email: true,
        browser: true,
        mobile: false,
        desktop: true
      },
      error: null
    };
  } catch (error) {
    console.error('Failed to fetch notification preferences:', error);
    return { success: false, data: {}, error: error.message };
  }
};

// Update notification preferences (placeholder)
export const updateNotificationPreferences = async (preferences) => {
  try {
    return { success: true, data: preferences, error: null };
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Check if user is a first-time user
export const checkFirstTimeUser = async () => {
  try {
    const result = await getNotifications({ limit: 1 });
    const notifications = result.data || [];
    return notifications.length === 0;
  } catch (error) {
    console.error('Failed to check first-time user:', error);
    return false;
  }
};

// Generate mock notifications (dev helper)
export const generateMockNotifications = () => [
  {
    id: 'welcome_001',
    type: 'welcome',
    title: 'Welcome to Agno WorkSphere!',
    message:
      'Welcome to your new workspace! Start by exploring your dashboard and setting up your first project.',
    timestamp: new Date(),
    isRead: false,
    read: false,
    priority: 'high',
    data: {
      isWelcome: true,
      actions: [
        { label: 'Get Started', variant: 'default', action: 'tour' },
        { label: 'View Profile', variant: 'outline', action: 'profile' },
      ],
    },
  },
];

// Helper functions for specific notification types
export const notifyProjectCreated = async (projectData, creatorId) => {
  try {
    return createNotification({
      user_id: creatorId,
      title: 'Project Created',
      message: `Your project "${projectData.name}" has been created successfully.`,
      type: 'project',
      priority: 'medium',
      action_url: `/projects/${projectData.id}`,
      notification_metadata: { projectId: projectData.id }
    });
  } catch (error) {
    console.error('Failed to notify project created:', error);
    return { success: false, data: null, error: error.message };
  }
};

export const notifyTaskAssigned = async (taskData, assigneeId, assignerId) => {
  try {
    return createNotification({
      user_id: assigneeId,
      title: 'Task Assigned',
      message: `You have been assigned a new task: "${taskData.title}".`,
      type: 'task',
      priority: 'high',
      action_url: `/tasks/${taskData.id}`,
      notification_metadata: { taskId: taskData.id, assignerId }
    });
  } catch (error) {
    console.error('Failed to notify task assigned:', error);
    return { success: false, data: null, error: error.message };
  }
};

export const notifyTaskCompleted = async (taskData, projectOwnerId) => {
  try {
    return createNotification({
      user_id: projectOwnerId,
      title: 'Task Completed',
      message: `Task "${taskData.title}" has been completed.`,
      type: 'task',
      priority: 'medium',
      action_url: `/tasks/${taskData.id}`,
      notification_metadata: { taskId: taskData.id }
    });
  } catch (error) {
    console.error('Failed to notify task completed:', error);
    return { success: false, data: null, error: error.message };
  }
};

export const notifyTaskUpdated = async (taskData, projectOwnerId) => {
  try {
    return createNotification({
      user_id: projectOwnerId,
      title: 'Task Updated',
      message: `Task "${taskData.title}" has been updated.`,
      type: 'task',
      priority: 'low',
      action_url: `/tasks/${taskData.id}`,
      notification_metadata: { taskId: taskData.id }
    });
  } catch (error) {
    console.error('Failed to notify task updated:', error);
    return { success: false, data: null, error: error.message };
  }
};

export const notifyTeamMemberAdded = async (
  memberData,
  projectId,
  projectOwnerId
) => {
  try {
    return createNotification({
      user_id: projectOwnerId,
      title: 'Team Member Added',
      message: `${memberData.name} has been added to your project.`,
      type: 'team',
      priority: 'medium',
      action_url: `/projects/${projectId}/members`,
      notification_metadata: { projectId, memberId: memberData.id }
    });
  } catch (error) {
    console.error('Failed to notify team member added:', error);
    return { success: false, data: null, error: error.message };
  }
};

// Real-time notification manager
class NotificationManager {
  constructor() {
    this.listeners = new Set();
    this.notifications = [];
    this.isPolling = false;
    this.pollingInterval = null;
  }

  // Start real-time polling
  startRealTime() {
    if (this.isPolling) return;

    this.isPolling = true;
    this.pollingInterval = setInterval(async () => {
      try {
        const result = await getNotifications();
        if (result.success) {
          this.notifications = result.data;
          this.notifyListeners();
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, 30000); // Poll every 30 seconds

    console.log('Real-time notifications started');
  }

  // Stop real-time polling
  stopRealTime() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('Real-time notifications stopped');
  }

  // Add listener
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify listeners
  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.notifications);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }
}

// Create singleton instance
const notificationManager = new NotificationManager();

// Default export
const notificationService = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createWelcomeNotification,
  createNotification,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  checkFirstTimeUser,
  generateMockNotifications,
  // New notification helpers
  notifyProjectCreated,
  notifyTaskAssigned,
  notifyTaskCompleted,
  notifyTaskUpdated,
  notifyTeamMemberAdded,
  // Real-time manager
  manager: notificationManager,
};

export default notificationService;