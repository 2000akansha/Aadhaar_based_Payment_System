import jwt from "jsonwebtoken";
import User from "../models/auth/userCred.model.js";
import UserDetail from "../models/auth/userDetail.model.js";
import ErrorHandler from "./error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

const requireAuth = catchAsyncError(async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(req.headers);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new ErrorHandler(
        "Authorization token required or improperly formatted",
        401,
      ),
    );
  }

  const token = authorization.split(" ")[1];
  // console.log(token);

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedToken.id).select("_id name role");

    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired, please log in again", 401));
    }
    return next(new ErrorHandler("Unauthorized, invalid token", 401));
  }
});

export default requireAuth;
