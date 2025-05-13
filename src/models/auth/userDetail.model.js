import mongoose from "mongoose";
import { type } from "os";
import validator from "validator";
const userDetailSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  
    userCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    phoneNumber: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    role: {
      type: String,
      enum: ["0", "1", "2", "3", "4"], //0-superadmin, 1-finance, 2-Dm, 3-checker, 4-customer/applicant
    },
    username: {
      type: String,
    },
    updateMasterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UpdateMaster",
      default: null,
    },
    userLevel: {
      type: String,
      enum: ["0", "1", "2", "3"],
      default: "0",
    },

    userStatus: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },
    isDeleted: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },
  },
  { timestamps: true },
);

userDetailSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const UserDetail = mongoose.model("UserDetail", userDetailSchema);

export default UserDetail;
