import dotenv from "dotenv";
dotenv.config();
import express, { application } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { errorMiddleware } from "./src/middleware/error.js";
import userRouter from "./src/routes/authentication/user.routes.js";
import excelUploadRouter from "./src/routes/uploadExcel/excelupload.js"
// import helmet from "helmet";
// import { startEmailProcessor } from '././src/controllers/Jobs/emailJobs.js';

import expressInterceptor from "express-interceptor";
import {
  validate,
  validateRequestBody,
  validateParams,
  validateQueryParams,
} from "./src/validationChecker/requestBody.validator.js"; // Adjust path// import {cacheMiddleware} from "./src/middleware/createGlobalCache.js";
const app = express();

// const interceptor = expressInterceptor(function (req, res) {
//   return {
//     isInterceptable: function () {
//       return true; // Decide if the response should be intercepted
//     },
//     intercept: function (body, send) {
//       send(body); // Send the intercepted response body
//     },
//     afterSend: (oldBody, newBody) => { },
//   };
// });

// app.use(interceptor);
// app.use(cacheMiddleware);
// app.js
// import {
// logReqRes,
// morganMiddleware,
// } from "./src/middleware/logger.middleware.js"; // Import the logger from logger.js
import requireAuth from "./src/middleware/auth.js";
import verifyHmac from "./src/middleware/verifyHmac.js";
// import staticFileMiddleware from "./src/middleware/files.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use current working directory to resolve uploads path
const staticPath = path.join(process.cwd(), "uploads");

console.log("✅ Serving static files from:", staticPath);

app.use("/uploads", express.static(staticPath));

const allowedOrigins = process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(',') : [];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'), false);  
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT'],  // Allowed methods
  credentials: true,  // Allow credentials (cookies, etc.) to be sent
}));

// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the request's origin is in the allowed origins list or if there's no origin (e.g., from same domain)
//     if (process.env.allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);  // Allow the request
//     } else {
//       callback(new Error('Not allowed by CORS'), false);  // Reject the request
//     }
//   },
//   methods: ['GET', 'POST', 'DELETE', 'PUT'],  // Allowed methods
//   credentials: true,  // Allow credentials (cookies, etc.) to be sent
// }));


// app.use(
//   cors({
//     origin: true,
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//   }),
// );

















// app.use((req, res, next) => {
//   // res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

//   next();
// });
 
// app.use(cors(
//     {
//     origin: true,
//     methods: ['GET', 'POST', 'DELETE', 'PUT'],  // Allowed methods
//     credentials: true,  // Allow credentials (cookies, etc.) to be sent
//   }
// ));


app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// / Serve static files with security headers
// app.use('/uploads', staticFileMiddleware());
// app.use(helmet());
// app.use(validate(validateRequestBody));

// // Apply validation middleware globally except for GET requests
// app.use((req, res, next) => {
//   if (req.method !== "GET") {
//     return validate(validateRequestBody)(req, res, next);
//   }
//   next();
// });
// Global middleware to handle validation
// app.use((req, res, next) => {
//   // Apply validation to all methods except GET
//   if (req.method !== 'GET') {
//     // First, validate the request body
//     validate(validateRequestBody)(req, res, (err) => {
//       if (err) return next(err); // If validation fails, stop further processing

//       // Then, validate the query parameters (if any)
//       validate(validateQueryParams)(req, res, (err) => {
//         if (err) return next(err); // If validation fails, stop further processing

//         // Finally, validate the URL parameters (if any)
//         validate(validateParams)(req, res, (err) => {
//           if (err) return next(err); // If validation fails, stop further processing
//           next(); // Proceed to the next middleware if all validations pass
//         });
//       });
//     });
//   } else {
//     // Skip validation for GET requests
//     next();
//   }
// });

// Apply validation middleware globally except for GET requests
// app.use((req, res, next) => {
//   if (req.method !== "GET") {
//     const requestBodyKeys = Object.keys(req.body);

//     // Extract the first key dynamically (e.g., newWardData, newZoneData, etc.)
//     if (requestBodyKeys.length > 0) {
//       const parentKey = requestBodyKeys.find((key) => key.startsWith("new"));

//       if (parentKey) {
//         return validate(validateRequestBody)(req, res, next);
//       }
//     }
//   }
//   next();
// });

// Global HMAC middleware (skipped for file upload routes)
// app.use((req, res, next) => {
//   if (req.is("multipart/form-data")) {
//     return next();
//   }
//   // Skip verification for static files
//   if (req.url.startsWith("/uploads")) {
//     return next();
//   }
//   return verifyHmac(req, res, next);
// });

// app.use(morganMiddleware);
// app.use(logReqRes());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/excel", excelUploadRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// unreadMsgCountCron();
// app.use(mainIntercept)
// startEmailProcessor(); // Start the email processing job

app.use(errorMiddleware);
export default app;
