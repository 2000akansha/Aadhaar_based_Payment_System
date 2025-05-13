import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      
    },
   
    cipherPassword: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["0", "1", "2", "3", "4"],  //0-SA 1-Finance 2-DM 3-DC 4-Customer
      // default: "0",
    },
    userStatus: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.statics.signup = async function (
  username,
  cipherPassword,
  fullName,
  role,
  email,
  phoneNumber,
) {
  const validRoles = ["0", "1", "2", "3"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    throw new Error("Username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(cipherPassword, salt);

  const user = await this.create({
    username,
    cipherPassword: hash,
    plainPassword: cipherPassword,
  });

  const UserDetail = mongoose.model("UserDetail");
  const userDetail = await UserDetail.create({
    userId: user._id,
    fullName,
    role,
    email,
    phoneNumber,
  });

  return { user, userDetail };
};

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const match = await bcrypt.compare(password, user.cipherPassword);

  if (!match) {
    throw new Error("Invalid username or password");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
