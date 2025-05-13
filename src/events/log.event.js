import { appEmitter } from './eventEmitter.js';
import { logActivity } from '../services/logService.js'; // Service to save logs to DB or elsewhere

// 📜 Listen for "log.activity" events
appEmitter.onEvent("log.activity", async (payload) => {
  try {
    const {
      userId,             // User ID
      activityType,       // Type of activity (e.g., 'login', 'logout', 'failed-login')
      details = {},       // Additional details (e.g., IP, device, etc.)
      timestamp = new Date(), // Activity timestamp
    } = payload;

    // Log the activity (save to DB or another service)
    await logActivity({
      userId,
      activityType,
      details,
      timestamp
    });

    console.log(`📚 Logged activity for user ${userId}: ${activityType}`);
  } catch (err) {
    console.error("❌ Failed to log activity via event:", err.message);
  }
});
