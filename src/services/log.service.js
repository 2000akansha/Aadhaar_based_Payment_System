import Log from "../models/log.js"; // Mongoose model for logging user activities

/**
 * Save user activity to the database (or other services)
 */
export const logActivity = async ({ userId, activityType, details, timestamp }) => {
  return await Log.create({
    userId,
    activityType,
    details,
    timestamp,
  });
};
