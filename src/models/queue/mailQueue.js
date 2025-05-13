import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    emailReference: {  // This is the new field for messageId or email_reference
      type: String,
      
    },
    senderId: {
      type: String,
      default: null
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    receiverId: {
      type: String,
      default: null
    },
    receiverMailId: {
      type: String
    },
    body: {
      type: String
    },
    subject: {
      type: String
    },
    emailType: {
      type: String,
      enum: ["login", "application_submission", "application_received", "payment_refunded", "change_password", "forgot_password", "email_verification", "order_confirmation", "order_shipped", "order_delivered", "order_cancelled", "order_returned", "order_refund_initiated", "order_refund_completed", "order_refund_failed"],
    },
    priority: {
      type: String,
      enum: ["0", "1", "2"], // 0=high 1=medium 2=low
      default: "1"
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      
    status: {
      type: String,
      enum: ["0", "1", "2", "3"], //"pending","processing","completed","failed"
      default: "0"
    },
    maxAttempts: {
      type: Number,
      default: 5
    },
    attempts: {
      type: Number,
      default: 0
    },
    scheduledAt: {
      type: Date,
      default: Date.now
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    lastRunAt: {
      type: Date,
      default: null
    },
    failure: [{
      failureTime: {
        type: Date,
        default: Date.now
      },
      retryCount: {
        type: Number,
        default: 0
      },
      errorMessage: {
        type: String
      },
    }]
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt fields
  }
);

const Queue = mongoose.model("Queue", queueSchema);
export default Queue;
