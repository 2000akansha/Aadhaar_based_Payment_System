import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  loginAt: {
    type: Date,
  },
  userIP: {
    type: String,
  },
  userBrowser: {
    type: String,
  },
  deviceType: {
    type: String,
  },
  operatingSystem: {
    type: String,
  },
  loginStatus: {
    type: String,
  },
  sessionId: {
    type: String,
  },

  geolocation: {
    type: {
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
    },
  },
  userAgent: {
    type: String,
  },
});

const loginHistory = mongoose.model("loginHistory", loginHistorySchema);

export default loginHistory;
