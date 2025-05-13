import Queue from "../models/queue.js";

/**
 * Adds an email to the queue (MongoDB)
 */
export const queueEmail = async ({
  receiverMailId,
  templateKey,
  variables = {},
  subject = "",
  scheduledAt = new Date(),
  priority = "0",
  senderId = null,
  receiverId = null,
}) => {
  return await Queue.create({
    senderId,
    receiverId,
    receiverMailId,
    templateKey,
    variables,
    subject,
    status: "0", // pending
    isLocked: false,
    priority,
    scheduledAt,
    attempts: 0,
    maxAttempts: 5,
    failure: [],
  });
};
