// Success Response Function (Updated)
const successResponse = (res, message = "Successful operation", data = []) => {
  return res.json({
    status: "success",
    message, // Include message in the response
    data: Array.isArray(data) ? data : [data], // Ensure data is always an array
  });
};

// Error Response Function (Updated)
const errorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 400,
) => {
  return res.status(statusCode).json({
    status: "error",
    message: Array.isArray(message) ? message : [message], // Ensure message is always an array
  });
};

export { errorResponse, successResponse };

// Custom Error Handler Class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Global Error Middleware
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Mongoose CastError (Invalid ID)
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not found. Invalid ${err.path}`, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} Entered`,
      400,
    );
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Json Web Token is invalid, Try again!", 400);
  }
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Json Web Token is expired, Try again!", 400);
  }

  // Mongoose Validation Error (Schema Validation)
  if (err.name === "ValidationError") {
    err = new ErrorHandler(
      Object.values(err.errors)
        .map((val) => val.message)
        .join(", "),
      400,
    );
  }

  // ReferenceError (Accessing Undefined Variables)
  if (err instanceof ReferenceError) {
    err = new ErrorHandler("Reference error: " + err.message, 500);
  }

  // TypeError (Invalid Operation on a Data Type)
  if (err instanceof TypeError) {
    err = new ErrorHandler("Type error: " + err.message, 500);
  }

  // SyntaxError (Incorrect JSON Format)
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    err = new ErrorHandler("Invalid JSON format in request.", 400);
  }

  // RangeError (Invalid Number Range)
  if (err instanceof RangeError) {
    err = new ErrorHandler("Range error: " + err.message, 400);
  }

  // Unhandled Promise Rejection
  if (err.message.includes("UnhandledPromiseRejection")) {
    err = new ErrorHandler("Unhandled promise rejection occurred.", 500);
  }

  return res.status(err.statusCode).json({
    status: "error",
    message: err.message,
  });
};

export default ErrorHandler;
