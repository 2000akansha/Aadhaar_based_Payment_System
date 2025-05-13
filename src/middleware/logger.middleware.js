// // import fs from "fs";
// // import path from "path";
// // import { fileURLToPath } from "url";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // export function logReqRes() {
// //     return (req, res, next) => {
// //         let logFilename;
// //         switch (req.method) {
// //             case "POST":
// //                 logFilename = "post_requests.log";
// //                 break;
// //             case "GET":
// //                 logFilename = "get_requests.log";
// //                 break;
// //             case "PUT":
// //             case "PATCH":
// //                 logFilename = "update_requests.log";
// //                 break;
// //             case "DELETE":
// //                 logFilename = "delete_requests.log";
// //                 break;
// //             default:
// //                 return next();
// //         }

// //         const originalEnd = res.end;

// //         let responseBody = "";
// //         res.end = function (chunk, encoding, callback) {
// //             if (chunk) {
// //                 responseBody += chunk;
// //             }

// //             let parsedBody;
// //             try {
// //                 parsedBody = JSON.parse(responseBody);
// //             } catch (err) {
// //                 parsedBody = {};
// //             }
// //             const logEntry = `\n${new Date().toLocaleString()}: ${req.ip} ${req.method} ${req.path} ${JSON.stringify(req.body)} => ${res.statusCode}  ${parsedBody.message || "No message"} \n`;

// //             const logDir = path.resolve("logs");
// //             if (!fs.existsSync(logDir)) {
// //                 fs.mkdirSync(logDir);
// //             }
// //             fs.appendFile(path.join(logDir, logFilename), logEntry, (err) => {
// //                 if (err) {

// //                 }
// //             });

// //             originalEnd.call(this, chunk, encoding, callback);
// //         };

// //         next();
// //     };
// // }

// import express from 'express';
// import winston from 'winston';
// import morgan from 'morgan';
// import path from 'path';
// import fs from 'fs';
// import { format } from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

// // Import fileURLToPath from url module
// import { fileURLToPath } from 'url';

// // Import geoip-lite to get geolocation details

// // Get the current filename and directory name
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Create logs directory if it doesn't exist
// const logDir = path.resolve('logs');
// if (!fs.existsSync(logDir)) {
//     fs.mkdirSync(logDir);
// }

// // Create a custom format for Winston (pretty JSON)
// const logFormat = format.combine(
//     format.timestamp(),
//     format.printf(({ timestamp, level, message, reqBody, resBody, ip, location, ...metadata }) => {
//         // Create the log object with reqBody, resBody, ip, and location included
//         const log = {
//             timestamp,
//             level,
//             message,
//             reqBody,  // Include req.body as part of the log entry
//             resBody,  // Include res.body as part of the log entry
//             ip,       // Include the IP address of the request
//             location, // Include the location (city, country)
//             ...metadata,
//         };
//         // Return the log as a prettily formatted JSON string
//         return JSON.stringify(log, null, 4);  // '4' adds 4 spaces of indentation
//     })
// );

// // Initialize the Winston logger with daily file rotation
// const logger = winston.createLogger({
//     level: 'info',
//     format: logFormat, // Use pretty JSON format
//     transports: [
//         // Daily rotating file transport
//         new DailyRotateFile({
//             filename: path.join(logDir, 'requests-%DATE%.log'),
//             datePattern: 'YYYY-MM-DD',
//             zippedArchive: true,
//             maxSize: '20m',
//             maxFiles: '15d',  // Keep logs for the last 15 days
//         }),
//         new winston.transports.Console() // Also log to console for development
//     ]
// });

// import jwt from 'jsonwebtoken';  // If you're using JWT for authentication
// import geoip from 'geoip-lite';  // GeoIP library for location lookup

// // export function logReqRes() {
// //     return (req, res, next) => {
// //         const originalEnd = res.end;
// //         let responseBody = '';

// //         // Capture response body
// //         res.end = function (chunk, encoding, callback) {
// //             if (chunk) {
// //                 responseBody += chunk;
// //             }

// //             let parsedResponseBody;
// //             try {
// //                 parsedResponseBody = JSON.parse(responseBody);
// //             } catch (err) {
// //                 parsedResponseBody = {};
// //             }

// //             // Get the real client IP address
// //             let ip = req.ip || req.connection.remoteAddress;
// //             if (req.headers['x-forwarded-for']) {
// //                 ip = req.headers['x-forwarded-for'].split(',')[0]; // First IP from forwarded header
// //             }

// //             // Geolocate the IP (using geoip-lite as an example)
// //             const geo = geoip.lookup(ip);
// //             const location = geo ? `${geo.city}, ${geo.country}` : 'Location not found';

// //             // Extract userId from JWT (if available) from Authorization header
// //             let userId = null;
// //             if (req.headers.authorization) {
// //                 const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
// //                 try {
// //                     const decoded = jwt.verify(token, 'your_secret_key');  // Replace with your secret key
// //                     userId = decoded.userId;  // Assuming the userId is in the token payload
// //                 } catch (err) {
// //                     console.error('JWT verification failed:', err);
// //                 }
// //             }

// //             // Log the request and response details
// //             const logEntry = {
// //                 timestamp: new Date().toISOString(),
// //                 level: 'info',
// //                 message: `${req.method} ${req.path} ${res.statusCode}`,
// //                 userId,  // Log the userId (if available)
// //                 reqBody: req.body,  // Log the request body
// //                 resBody: parsedResponseBody.message || 'No message',  // Log the response body
// //                 ip,       // Log the real IP address of the request
// //                 location, // Log the location of the request
// //             };

// //             // Log request and response details to the file
// //             logger.info(logEntry);

// //             // Call the original res.end() function to ensure proper response
// //             originalEnd.call(this, chunk, encoding, callback);
// //         };

// //         next();
// //     };
// // }

// export function logReqRes() {
//     let serialNumber = 1;
//     return (req, res, next) => {
//         const originalEnd = res.end;
//         let responseBody = '';

//         res.end = function (chunk, encoding, callback) {
//             if (chunk) {
//                 responseBody += chunk;
//             }

//             let parsedResponseBody;
//             try {
//                 parsedResponseBody = JSON.parse(responseBody);
//             } catch (err) {
//                 parsedResponseBody = {};
//             }

//             // Helper function to recursively remove sensitive data
//             const sanitizeData = (data) => {
//                 if (data && typeof data === 'object') {
//                     for (const key in data) {
//                         if (data.hasOwnProperty(key)) {
//                             // Remove sensitive fields (e.g., password, passwordConfirmation)
//                             if (key === 'password' || key === 'passwordConfirmation' ||key ==='cipherPassword') {
//                                 delete data[key];
//                             }
//                             // Recursively sanitize nested objects (if any)
//                             if (typeof data[key] === 'object') {
//                                 data[key] = sanitizeData(data[key]);
//                             }
//                         }
//                     }
//                 }
//                 return data;
//             };

//             // Sanitize response body by removing passwords but keep everything else
//             const sanitizedResBody = sanitizeData({ ...parsedResponseBody });

//             // Capture userId if available
//             const userId = req.user ? req.user.id : 'No user found';

//             // Get the real client IP address
//             let ip = req.ip || req.connection.remoteAddress;
//             if (req.headers['x-forwarded-for']) {
//                 ip = req.headers['x-forwarded-for'].split(',')[0]; // First IP from forwarded header
//             }

//             // Geolocate the IP (using geoip-lite as an example)
//             const geo = geoip.lookup(ip);
//             const location = geo ? `${geo.city}, ${geo.country}` : 'Location not found';

//             // Construct the full URL
//             const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

//             // Log the request and response details
//             const logEntry = {
//                 SerialNumber: serialNumber++,
//                 message: `${req.method} ${req.path} ${res.statusCode}`,
//                 userId: userId,
//                 URL: fullUrl,
//                 reqBody: req.body, // Include the full request body
//                 resBody: sanitizedResBody, // Include the sanitized response body
//                 ip,       // Log the real IP address of the request
//                 location, // Log the location of the request
//             };

//             logger.info(logEntry); // Log the details to the file

//             originalEnd.call(this, chunk, encoding, callback);  // Call the original res.end() function
//         };

//         next();
//     };
// };

// // export function logReqRes() {
// //     // Inside logReqRes middleware
// //     let serialNumber = 1;
// //     return (req, res, next) => {
// //         const originalEnd = res.end;
// //         let responseBody = '';

// //         res.end = function (chunk, encoding, callback) {
// //             if (chunk) {
// //                 responseBody += chunk;
// //             }

// //             let parsedResponseBody;
// //             try {
// //                 parsedResponseBody = JSON.parse(responseBody);
// //             } catch (err) {
// //                 parsedResponseBody = {};
// //             }

// //             // Capture userId if available
// //             const userId = req.user ? req.user.id : 'No user found';
// //             // Get the real client IP address
// //             let ip = req.ip || req.connection.remoteAddress;
// //             if (req.headers['x-forwarded-for']) {
// //                 ip = req.headers['x-forwarded-for'].split(',')[0]; // First IP from forwarded header
// //             }

// //             // Geolocate the IP (using geoip-lite as an example)
// //             const geo = geoip.lookup(ip);
// //             const location = geo ? `${geo.city}, ${geo.country}` : 'Location not found';

// //             // Extract userId from JWT (if available) from Authorization header
// //             // let userId = null;
// //             if (req.headers.authorization) {
// //                 const token = req.headers.authorization.split(' ')[1];  // Bearer <token>
// //                 try {
// //                     const decoded = jwt.verify(token, 'your_secret_key');  // Replace with your secret key
// //                     userId = decoded.userId;  // Assuming the userId is in the token payload
// //                 } catch (err) {
// //                     // console.error('JWT verification failed:', err);
// //                 }
// //             }
// //             // Construct the full URL
// //             const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

// //             // Log the request and response details
// //             const logEntry = {
// //                 SerialNumber: serialNumber++,
// //                 // timestamp: new Date().toISOString(),
// //                 // level: 'info',
// //                 message: `${req.method} ${req.path} ${res.statusCode}`,
// //                 userId: userId,
// //                 URL: fullUrl, // Log the userId here
// //                 reqBody: req.body,
// //                 resBody: parsedResponseBody.message || 'No message',
// //                 ip,       // Log the real IP address of the request
// //                 location, // Log the location of the request
// //             };

// //             logger.info(logEntry); // Log the details to the file

// //             originalEnd.call(this, chunk, encoding, callback);  // Call the original res.end() function
// //         };

// //         next();
// //     };
// // };

// // Set up morgan to log HTTP request information
// const morganMiddleware = morgan('combined', {
//     stream: {
//         write: (message) => {
//             logger.info(message.trim());  // Log morgan's request logs using Winston
//         },
//     },
// });

// // Export the logger and middleware
// export { logger, morganMiddleware };
