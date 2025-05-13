import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/auth/userCred.model.js";
import loginHistory from "../../models/auth/loginHistory.model.js";
import useragent from "useragent";
// import UserDetail from "../../models/auth/userDetail.model.js";
import { successResponse, errorResponse } from "../../middleware/error.js";
import ErrorHandler from "../../middleware/error.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import geoip from "geoip-lite";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import {
  isValidPassword,
  isAlpha,
  isAlphaUsername,
  isValidPhoneNumber,
  isValidEmail,
  matchPassword,
  formatAmount,
} from "../../utils/helperfunctions.js";
import Queue from "../../models/queue/mailQueue.js";
import { getTemplateHtml } from "../../template/mailTemplate.js";
import UserDetail from "../../models/auth/userDetail.model.js";
// import { validateRequestBodyAsync } from "../../validation.checker.js/requestBody.validator.js";
const createToken = (id, role) => {
  return jwt.sign({ id, role: role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

const getGeolocationFromIP = (ipAddress) => {
  const geo = geoip.lookup(ipAddress);
  if (geo) {
    return {
      latitude: geo.ll[0], // Latitude
      longitude: geo.ll[1], // Longitude
    };
  }
  // Return default if geolocation is not found
  return { latitude: 0, longitude: 0 };
};
const loginUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { username, password, role } = req.body;

  const errors = [];

  if (!username || !password || !role) {
    errors.push("Username, password, and role are required.");
  }

  const usernameError = isAlphaUsername(username);
  if (usernameError) errors.push(usernameError);

  if (errors.length > 0) {
    await session.abortTransaction();
    session.endSession();
    return next(new ErrorHandler(errors.join(", "), 400));
  }

  try {
    // Find the user within the session
    const user = await User.findOne({ username }).session(session);
    if (!user) {
      // throw new ErrorHandler("Invalid username or password", 400);

      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Invalid username or password", 400);
    }
    const UseDetail = await UserDetail.findOne({ userId: user._id }).session(session);
    const userEmail = UseDetail?.email;

    if (!userEmail) {
      throw new ErrorHandler("User email not found", 400);
    }

    const isPasswordCorrect = await bcrypt.compare(
      password.trim(),
      user.cipherPassword.trim(),
    );
    if (!isPasswordCorrect) {
      // throw new ErrorHandler("Invalid username or password", 400);
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Invalid username or password missing", 400);
    }

    if (user.role !== role) {
      //  throw new ErrorHandler("Invalid role", 400);

      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Invalid role", 400);
    }
    // Generate JWT token
    const token = createToken(user._id, user.role);

    // User agent and IP extraction
    const userIP =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);

    let userBrowser = "Unknown Browser";
    let deviceType = "Unknown Device";
    let operatingSystem = "Unknown OS";

    if (userAgentString.includes("Postman")) {
      userBrowser = "Postman API Client";
      deviceType = "Desktop";
      operatingSystem = "Unknown OS";
    } else if (agent.family !== "Other") {
      userBrowser = `${agent.family} ${agent.major}`;
      operatingSystem = agent.os.family;
      deviceType = agent; // Define this function in utils
    }

    // Get geolocation based on user IP
    let geolocationLat = 0;
    let geolocationLong = 0;

    if (userIP && userIP !== "::1") {
      const { latitude, longitude } = getGeolocationFromIP(userIP);
      geolocationLat = latitude;
      geolocationLong = longitude;
    }

    // Create login history
    const sessionId = uuidv4();
    const newLoginHistory = await loginHistory.create(
      [
        {
          userId: user._id,
          loginAt: new Date(),
          userIP,
          userBrowser,
          deviceType,
          operatingSystem,
          loginStatus: "success",
          sessionId,
          geolocation: { lat: geolocationLat, long: geolocationLong },
          userAgent: userAgentString,
        },
      ],
      { session },
    );


    // // Prepare email content for login notification
    // const Body = getTemplateHtml('login_notification', {
    //   name: user.fullName,
    //   loginTime: new Date().toLocaleString(),
    //   device: userBrowser,
    //   location: `${geolocationLat}, ${geolocationLong}`,
    // });

    // await Queue.create(
    //   [
    //     {
    //       senderId: null,
    //       receiverId: user._id,
    //       receiverMailId: UseDetail.email, // ensure this field exists
    //       subject: "New Login Detected",
    //       body: Body, // not needed, will be generated in the job
    //       emailType: "login", // template name
    //       payload: {
    //         name: user.fullName,
    //         loginTime: new Date().toLocaleString(),
    //         device: userBrowser,
    //         location: `${geolocationLat}, ${geolocationLong}`
    //       },
    //       priority: "0",       // high priority
    //       status: "0",         // pending
    //       maxAttempts: 5,
    //       scheduledAt: new Date(),
    //     },
    //   ],
    //   { session }
    // );

    // console.log(user.email, "user.email");


    if (!newLoginHistory[0])
      throw new ErrorHandler("Error saving login history", 500);

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Logged in successfully", {
      fullName: user.fullName,
      username: user.username,
      id: user._id,
      role: user.role,
      areaCode: user.areaCode,
      location: user.location,
      token,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
};

const signupUser = catchAsyncError(async (req, res, next) => {
  let session = null;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const {
      fullName,
      username,
      password,
      name,
      role,
      email,
      phoneNumber,
      areaCode,
      location,
      address,
    } = req.body;
    console.log("req.body", req.body);

    const checkUsername = await User.findOne({ username }).session(session);
    if (checkUsername) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Duplicate username. Signup not allowed", 400);
    }

    // // Password regex validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    if (!passwordRegex.test(password)) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(
        res,
        "Password must meet security requirements.",
        400,
      );
    }

    // Hash Password (ensure password and salt are valid)
    const salt = await bcrypt.genSalt(10);
    if (!salt) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Error generating salt", 500);
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    if (!hashedPassword) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Error hashing password", 500);
    }

    // Create User
    const user = await User.create(
      [
        {
          username,
          cipherPassword: hashedPassword,
          role,
          plainPassword: password,
        },
      ],
      { session },
    );

    if (!user[0]) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Error creating User", 400);
    }

    // Create UserDetail
    const userDetail = await UserDetail.create(
      [
        {
          userId: user[0]._id,
          fullName,
          email,
          // name: "Saharanpur Superadmin",
          phoneNumber,
          areaCode,
          location,
          address,
          role,
          username,
        },
      ],
      { session },
    );

    if (!userDetail[0]) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Error creating UserDetail", 400);
    }

    // Commit the transaction only after both User and UserDetail creation are successful
    await session.commitTransaction();
    session.endSession();

    // Generate Token (if needed)
    const token = createToken(user[0]._id, role);

    // Return response
    return successResponse(res, "Signup successful", {
      userId: user[0]._id,
      fullName: userDetail[0].fullName,
      username: userDetail[0].username,
      role: userDetail[0].role,
      email: userDetail[0].email,
      name: userDetail[0].name,
      phoneNumber: userDetail[0].phoneNumber,
      areaCode: userDetail[0].areaCode,
      location: userDetail[0].location,
      token,
    });
  } catch (err) {
    // Handle errors and abort transaction if necessary
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return errorResponse(res, err.message, 500);
  }
});

const changePassword = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { role: userRole, id: userId } = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Few fields missing.", 400);
    }

    // Validate password strength
    const newPasswordError = isValidPassword(newPassword);
    if (newPasswordError) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Invalid username or password", 400);
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(
        res,
        "new password doesnot match current password.",
        400,
      );
    }

    // Find user in the database
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "User not found", 400);
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.cipherPassword);
    if (!isMatch) {
      // return errorResponse(res, "Current password is incorrect");

      await session.abortTransaction();
      session.endSession();
      return errorResponse(res, "Current password is incorrect", 400);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update User collection (including plainPassword)
    await User.findByIdAndUpdate(
      userId,
      {
        cipherPassword: hashedPassword,
        plainPassword: newPassword,
        updatedAt: new Date(),
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, "Password updated successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return errorResponse(res, "Internal server error", 500);
  }
};

export { loginUser, signupUser, changePassword };
