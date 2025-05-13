import { appEmitter } from './eventEmitter.js';
import { queueEmail } from '../services/emailQueue.service.js';

// 📧 Listen for "email.send" events
appEmitter.onEvent("email.send", async (payload) => {
  try {
    const {
      to,                   // Receiver's email
      templateKey,          // ZeptoMail template identifier
      variables = {},       // Key-value pairs for dynamic content
      subject = "Notification from DOI", // Optional subject
      scheduledAt = new Date(),          // For queuing/delayed delivery
      priority = "0",                    // Optional priority
      senderId = null,                   // Optional sender reference
      receiverId = null,                 // Optional receiver user ID
    } = payload;

    await queueEmail({
      receiverMailId: to,
      templateKey,
      variables,
      subject,
      scheduledAt,
      priority,
      senderId,
      receiverId
    });

    console.log(`📨 Email queued to ${to} using template "${templateKey}"`);
  } catch (err) {
    console.error("❌ Failed to queue email via event:", err.message);
  }
});
