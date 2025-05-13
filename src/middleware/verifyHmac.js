import CryptoJS from "crypto";
import ErrorHandler from "./error.js"; // Function to convert formdata into string
const formDataToString = (body, files) => {
  const sortedEntries = []; // Handle text fields (req.body)
  Object.keys(body).forEach((key) => {
    sortedEntries.push(`${key}=${body[key]}`);
  }); // Handle file fields (req.files)
  if (files) {
    Object.keys(files).forEach((key) => {
      const fileArray = files[key];
      const fieldName = fileArray[0].fieldname; // Generate a string for each file name in the array
      const fileNames = fileArray
        .map((file) => file.originalname)
        .join("&" + fieldName + "="); // Add the concatenated file names to the sortedEntries array
      sortedEntries.push(`${fieldName}=${fileNames}`);
    });
  }
  sortedEntries.sort(); // Sort for consistency
  return sortedEntries.join("&");
};

const verifyHmac = (req, res, next) => {
  const SECRET_KEY = process.env.INTEGRITY_SECRET_KEY;
  const receivedHash = req.headers["x-signature"];
  console.log(receivedHash, "-----f-----");

  if (!receivedHash) {
    throw new ErrorHandler("Missing HMAC signature", 400);
  }
  try {
    let payloadString;
    if (req.is("multipart/form-data")) {
      // Handle FormData
      payloadString = formDataToString(req.body, req.files);
    } else if (req.body && Object.keys(req.body).length > 0) {
      // Handle JSON requests (ensure there's actual content in body)
      payloadString = JSON.stringify(req.body);
    } // In case the payload is empty, we use an empty string (""),
    if (!payloadString) {
      payloadString = ""; // Make sure payloadString is empty for empty bodies
    } // Compute HMAC hash
    const computedHash = CryptoJS.createHmac("sha256", SECRET_KEY)
      .update(payloadString)
      .digest("hex");

    console.log(computedHash, "-----b-----");
    if (computedHash !== receivedHash) {
      throw new ErrorHandler(
        "Payload integrity check failed! Possible tampering.",
        403,
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
export default verifyHmac;
