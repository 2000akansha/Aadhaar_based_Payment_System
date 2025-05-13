/**
 * Helper function to format a Date object or timestamp to DD-MM-YYYY format.
 * @param {Date | number} date - The Date object or timestamp to be formatted.
 * @returns {string} - The formatted date string in DD-MM-YYYY format.
 * @throws {Error} - Throws an error if the input is not a valid Date or timestamp.
 */
const formatDateToDDMMYYYY = (date, fieldName = "Date") => {
  // If the date is a number (timestamp), convert it to a Date object
  if (typeof date === "number") {
    date = new Date(date);
  }
  // console.log(date);

  // Check if the date is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error(`Invalid date passed for  ${fieldName}.`);
  }

  // Extract the day, month, and year from the Date object
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const year = date.getFullYear();

  // Return the date in DD/MM/YYYY format
  return `${day}-${month}-${year}`;
};

export { formatDateToDDMMYYYY }; // Export the function







const sanitizeExcelValue = (value) => {
  if (value === null || value === undefined) return "";

  // Handle object values like richText, hyperlinks, formulas
  if (typeof value === 'object') {
    // 🔴 RichText (potentially styled text)
    if (value.hasOwnProperty('richText')) {
      const parts = value.richText;

      if (!Array.isArray(parts)) {
        throw new Error("Invalid richText format");
      }

      for (const part of parts) {
        const { text, font } = part;

        if (!text) {
          throw new Error("richText part missing text content");
        }

        // ❌ Throw error for any styling
        if (
          font?.bold || 
          font?.italic || 
          font?.underline || 
          font?.strike || 
          font?.color || 
          font?.size || 
          font?.name || 
          font?.family || 
          font?.scheme
        ) {
          throw new Error("Cell contains styled text (bold, italic, underline, color, size, etc.)");
        }
      }

      // ✅ Clean and return unstyled richText
      const combinedText = parts.map(p => p.text).join('');
      return combinedText.replace(/[\n\r]+/g, '').trim();
    }

    // 🔵 Simple text object (like hyperlinks)
    if (value.hasOwnProperty('text')) {
      return value.text.replace(/[\n\r]+/g, '').trim();
    }

    // ❌ Reject formulas
    if (value.hasOwnProperty('formula')) {
      throw new Error("Cell contains a formula — not allowed");
    }

    // ❌ Any other structure is unsupported
    throw new Error("Unsupported Excel cell structure");
  }

  // ✅ Basic string or number — clean up
  return String(value).replace(/[\n\r]+/g, '').trim();
};


export { sanitizeExcelValue };








/**
 * Helper function to format a Date object or timestamp to YYYY-MM-DD format.
 * @param {Date | number} date - The Date object or timestamp to be formatted.
 * @returns {string} - The formatted date string in DD-MM-YYYY format.
 * @throws {Error} - Throws an error if the input is not a valid Date or timestamp.
 */
const formatDateToYYYYMMDD = (date, fieldName = "Date") => {
  // If the date is a number (timestamp), convert it to a Date object
  if (typeof date === "number") {
    date = new Date(date);
  }

  // Check if the date is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error(`Invalid date passed for  ${fieldName}.`);
  }

  // Extract the day, month, and year from the Date object
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const year = date.getFullYear();
  // Return the formatted date in DD-MM-YYYY format
  return `${year}-${month}-${day}`;
};
export { formatDateToYYYYMMDD }; // Export the function

const formatMonth = (date, fieldName = "Date") => {
  if (!date) return null;

  const dateParts = date.split("-");
  if (dateParts.length === 3) {
    const [day, month, year] = dateParts;
    return parseInt(month); // Return the month (1-12)
  }
  throw new Error(`Invalid date passed for ${fieldName}.`);
};

export { formatMonth };
const formatYear = (date, fieldName = "Date") => {
  if (!date) return null;

  // If the date is a string in 'DD-MM-YYYY' format, we need to reformat it to 'YYYY-MM-DD'
  if (typeof date === "string") {
    const dateParts = date.split("-");
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      date = new Date(`${year}-${month}-${day}`);
    }
  }

  // Check if it's a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error(`Invalid date passed for ${fieldName}.`);
  }

  // Extract and return the year from the Date object
  return date.getFullYear();
};
export { formatYear };

/**
 * Helper function to format a Date object or timestamp to YYYY-MM-DD format.
 * @param {Date | number} date - The Date object or timestamp to be formatted.
 * @returns {string} - The formatted date string in DD-MM-YYYY format.
 * @throws {Error} - Throws an error if the input is not a valid Date or timestamp.
 */
const formatDateToMMDDYYYY = (date, fieldName = "Date") => {
  // If the date is a number (timestamp), convert it to a Date object
  if (typeof date === "number") {
    date = new Date(date);
  }

  // Check if the date is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error(`Invalid date passed for  ${fieldName}.`);
  }

  // Extract the day, month, and year from the Date object
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const year = date.getFullYear();

  // Return the formatted date in DD-MM-YYYY format
  return `${month}-${day}-${year}`;
};
export { formatDateToMMDDYYYY }; // Export the function
function sortDataByFinancialYear(data, startYear) {
  // Get the start and end dates of the financial year
  const startDate = new Date(`${startYear}-04-01`);
  const endDate = new Date(`${startYear + 1}-03-31`);

  // Filter the data to include only entries within the financial year and sort by date
  return data
    .filter((item) => {
      const currentDate = new Date(item.date);
      return currentDate >= startDate && currentDate <= endDate; // Check if date is within the financial year
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
}

export { sortDataByFinancialYear };

/**
 * Validates the financial year format.
 * The valid format is 'YYYY-YYYY' where both years are valid.
 * @param {string} financialYear - The financial year string to validate.
 * @returns {boolean} - True if the format is valid, false otherwise.
 */
export const isValidFinancialYear = (financialYear) => {
  // Validate the format of the financial year as 'YYYY-YYYY'
  const regex = /^\d{4}-\d{4}$/;

  if (!regex.test(financialYear)) return false;

  // Split into start and end years
  const [startYear, endYear] = financialYear.split("-").map(Number);

  // Ensure that the start year is less than or equal to the end year
  return startYear <= endYear;
};

// // /**
// //  * Helper function to calculate pagination parameters.
// //  *
// //  * @param {number} page - The current page number.
// //  * @param {number} limit - The number of items per page.
// //  * @returns {object} - Returns an object with skip and limit values.
// //  */
function getPaginationParams(page, limit) {
  const skip = (page - 1) * limit;
  const pageLimit = Number(limit);
  return { skip, limit: pageLimit };
}

export { getPaginationParams };

/**
 * Helper function to format a number to Indian numbering system with ₹ symbol and two decimal places.
 * @param {number} amount - The number to be formatted.
 * @returns {string} - The formatted string with ₹ symbol, Indian numbering system, and two decimal places.
 */

import fmt from "indian-number-format";


const formatAmount = (amount) => {
  // Ensure amount is a number
  if (typeof amount !== "number") {
    return "₹ 0.00"; // Default return value if input is not a number
  }

  // Split the number into the integer and decimal parts
  const [integerPart, decimalPart] = amount.toFixed(2).split(".");

  // if (integerPart < 0)
  //     return '-' + '₹' + fmt.format(integerPart) + '.' + decimalPart;
  // else {
  // Return the formatted amount with ₹ symbol, integer part with commas, and decimal part
  return "₹ " + fmt.format(integerPart) + "." + decimalPart;
  // Return the formatted amount with ₹ symbol, integer part with commas, and decimal part
  return "₹ " + fmt.format(integerPart) + "." + decimalPart;
  // }
};

export { formatAmount };
const formatAadhaarNumber = (aadhaarNumber) => {
  // Check if the input is a number and a 12-digit number
  if (
    typeof aadhaarNumber !== "number" ||
    !/^\d{12}$/.test(aadhaarNumber.toString())
  ) {
    return " should be a 12-digit integer only.";
  }

  // Convert the number to string for easy manipulation
  let aadhaarStr = aadhaarNumber.toString();

  // Format the Aadhaar number into the pattern 'xxxx-xxxx-xxxx'
  const formattedAadhaar = aadhaarStr.replace(/(\d{4})(?=\d)/g, "$1-");

  return formattedAadhaar;
};

export { formatAadhaarNumber };

const formatPanCardNumber = (panCardNumber) => {
  // Check if the PAN card number is a string and matches the required pattern
  if (
    typeof panCardNumber !== "string" ||
    !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(panCardNumber)
  ) {
    return "should be in the format AAAAA9999A.";
  }

  // Return the PAN card number as is (no changes needed as it's already in the desired format)
  return panCardNumber;
};
export { formatPanCardNumber };

const formatIfscCode = (ifscCode) => {
  // console.log(ifscCode);

  if (!ifscCode) return null;
  // Check if the IFSC code is a string and matches the required pattern
  if (typeof ifscCode !== "string" || !/^[A-Z]{4}0\d{6}$/.test(ifscCode)) {
    return "format is incorrect.";
  }
  //     // Return null if valid
  return null;
};

export { formatIfscCode };

const disallowMaliciousCode = (fieldValue, fieldName) => {
  console.log("malicious :- ", fieldValue);

  // Extended list of dangerous patterns (SQL Injection, XSS, RCE, File Inclusion, etc.)
  const dangerousPatterns = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "CREATE",
    "RENAME",
    "TRUNCATE",
    "UNION",
    "EXPLAIN",
    "DESCRIBE",
    "SHOW",
    "USE",
    "FROM",
    "WHERE",
    "HAVING",
    "GROUP BY",
    "ORDER BY",
    "LIMIT",
    "INSERT INTO",
    "VALUES",
    "AND",
    "OR",
    "NOT",
    "BETWEEN",
    "LIKE",
    "IN",
    "IS",
    "EXISTS",
    "DISTINCT",
    "MATCH",
    "JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    "OUTER JOIN",
    "UNION ALL",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "SET",
    "BEGIN",
    "COMMIT",
    "ROLLBACK",
    "TRIGGER",
    "FUNCTION",
    "PROCEDURE",
    "DATABASE",
    "TABLE",
    "COLUMN",
    "CONCAT",
    "SLEEP",
    "BENCHMARK",
    "LOAD_FILE",
    "INFILE",
    "OUTFILE",
    "xp_",
    "benchmark",
    "eval",
    "exec",
    "system",
    "char",
    "hex",
    "substr",
    "substrb",
    "bin",
    "unhex",
    "load_file",
    "outfile",
    "declare",
    "execute",
    "dbms_pipe",
    "pl/sql",
    "sp_executesql",
    "pg_sleep",
    "<script>",
    "</script>",
    "<img>",
    "</img>",
    "onload=",
    "onerror=",
    "javascript:",
    "data:text/html",
    "document.cookie",
    "eval(",
    "alert(",
    "console.log",
    "setTimeout",
    "setInterval",
    "window.location",
    "XMLHttpRequest",
    "fetch",
    "cookie",
    "localStorage",
    "sessionStorage",
    "eval(",
    "Function(",
    "iframe",
    "system(",
    "exec(",
    "passthru(",
    "shell_exec(",
    "proc_open",
    "popen",
    "curl",
    "wget",
    "chmod",
    "chown",
    "netstat",
    "ps aux",
    "id",
    "whoami",
    "shutdown",
    "reboot",
    "fork",
    "execvp",
    "sudo",
    "rm -rf",
    "mkfs",
    "bash",
    "sh",
    "nc",
    "telnet",
    "ping",
    "nc -e",
    "php -r",
    "bash -i",
    "python -c",
    "perl -e",
    "ruby -e",
    "file://",
    "ftp://",
    "http://",
    "https://",
    "localhost",
    "127.0.0.1",
    "file_get_contents",
    "include",
    "require",
    "require_once",
    "include_once",
    "eval",
    'include("',
    'require("',
    "http://",
    "ftp://",
    "data://",
    "filter_input",
    "parse_ini_file",
    "fopen",
    "file_put_contents",
    "file_get_contents",
    "copy",
    "unlink",
    "rename",
    "chmod",
    "chown",
    "symlink",
    "proc_open",
    "popen",
    "exec",
    "system",
    "debug",
    ".env",
    "process.env",
    "getenv",
    "$_ENV",
    "$_SERVER",
    "$_FILES",
    "phpinfo",
    "getenv",
    "file_get_contents",
    "system(",
    "exec(",
    "passthru(",
    "shell_exec(",
    "proc_open",
    "popen",
    "curl",
    "wget",
    "system",
    "sudo",
    "rm -rf",
    "chmod",
    "chown",
    "netstat",
    "ps aux",
    "id",
    "whoami",
    "shutdown",
    "reboot",
    "fork",
    "execvp",
    "file_get_contents",
    "include",
    "require",
    "debug",
    "eval",
    "exec",
    "shell_exec",
    "system",
    "proc_open",
    "popen",
    "passthru",
    "chroot",
    "chdir",
    "chown",
    "chmod",
    "id",
    "whoami",
    "netstat",
    "tail",
    "cat",
    "curl",
    "CREATE DATABASE",
    "DROP DATABASE",
    "SHOW TABLES",
    "SELECT DATABASE",
    "REPLACE",
    "FROM INFORMATION_SCHEMA",
    "ORDER BY",
    "SELECT * FROM",
    "UNION SELECT",
    "SHOW DATABASES",
    "SHOW COLUMNS",
    "CONVERT",
    "IFNULL",
    "IFERROR",
    "LOAD DATA",
    "SLEEP",
    "BENCHMARK",
    "JOIN",
    "OUTER JOIN",
    "CROSS JOIN",
    "INNER JOIN",
    "LEFT JOIN",
  ];

  // Check if the field value is a string and is not empty
  if (typeof fieldValue !== "string" || !fieldValue.trim()) return false;

  // Convert the field value to uppercase for case-insensitive matching
  const inputUpper = fieldValue.toUpperCase();

  // Check if there are any forbidden patterns in the field value
  for (let pattern of dangerousPatterns) {
    const escapedPattern = escapeSpecialChars(pattern); // To avoid issues with regex special characters

    // Create a case-insensitive regex with word boundaries
    const regex = new RegExp(`\\b${escapedPattern}\\b`, "i");

    // Check if the pattern exists in the input
    if (regex.test(inputUpper)) {
      return `The word '${pattern}' is forbidden in the '${fieldName}' field.`;
    }
  }

  return false; // No harmful patterns found
};

// Helper to escape special regex characters in the dangerous patterns
const escapeSpecialChars = (pattern) => {
  return pattern.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"); // Escape special characters for regex
};

export { disallowMaliciousCode };

const minLength = (min) => (input) => {
  if (input && input.length < min) {
    return ` must be at least ${min} characters long.`;
  }
  return null;
};
export { minLength };

const maxLength = (max) => (input) => {
  if (input && input.length > max) {
    return ` must be no more than ${max} characters long.`;
  }
  return null;
};
export { maxLength };

const isAlpha = (input) => {
  if (!input) return null;

  if (!/^[A-Za-z\s]+$/.test(input)) {
    return " must contain only alphabetic characters.";
  }
  return null;
};

export { isAlpha };

const isNumeric = (input) => {
  if (!input || input == "0" || input == 0) return null;
  if (isNaN(input) || !/^\d+(\.\d+)?$/.test(input)) {
    return "must contain only numeric characters, including decimals.";
  }
  return null;
};
export { isNumeric };

const isAlphanumeric = (input, fieldName) => {
  if (!input) return null;
  // Check if the input contains only alphanumeric (letters and numbers), alphabetic, or numeric characters
  if (
    !/^[A-Za-z0-9\s]+$/.test(input) &&
    !/^[A-Za-z\s]+$/.test(input) &&
    !/^[0-9\s]+$/.test(input)
  ) {
    return `must contain only alphanumeric, alphabetic, or numeric characters, and spaces.`;
  }
  return null;
};

export { isAlphanumeric };

const isUpperCaseAlpha = (input) => {
  const regex = /^[A-Z\s]+$/; // Regular expression to allow only uppercase alphabetic characters (A-Z)
  if (!regex.test(input)) {
    return " should contain only uppercase characters.";
  }
  return null; // Valid input
};
export { isUpperCaseAlpha };

const isLowerCaseAlpha = (input) => {
  const regex = /^[a-z\s]*$/; // Allow empty string as well
  if (!regex.test(input)) {
    return " should contain only lowercase alphabetic characters (a-z).";
  }
  return null; // Valid input
};
export { isLowerCaseAlpha };

// Username validation (Only alphabetic characters)
// const isAlphaUsername = (username) => {
//     const regex = /^[A-Za-z]+$/;
//     if (!regex.test(username)) {
//         return 'Username should only contain alphabetic characters.';
//     }
//     return null;
// };

// export { isAlphaUsername };

const isAlphaUsername = (username) => {
  const regex = /^[A-Za-z0-9!.,;:()_&+=\-@]+$/; // This regex allows alphanumeric characters and a few special characters
  if (!regex.test(username)) {
    return "should not contain forbidden chars & symbols.";
  }
  return null;
};

export { isAlphaUsername };

// Email validation (Simple email regex)
const isValidEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return "Email should be a valid email address.";
  }
  return null;
};
export { isValidEmail };

const isValidPassword = (input) => {
  // Check if the password is provided (required)
  if (!input) {
    return "Password is required.";
  }

  // Check if the password meets the minimum length (8 characters)
  if (input.length < 4) {
    return "Password must be at least 4 characters long.";
  }

  // Check if the password exceeds the maximum length (20 characters)
  if (input.length > 20) {
    return "Password can be a maximum of 20 characters.";
  }

  // Regular expression to enforce password rules:
  // - At least one lowercase letter
  // - At least one uppercase letter
  // - At least one number
  // - At least one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{4,20}$/;

  // Test the input password against the regex pattern
  if (!passwordRegex.test(input)) {
    return "Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol.";
  }

  return null; // Valid password
};

export { isValidPassword };

const matchPassword = (password, confirmPassword) => {
  // console.log(password, confirmPassword);

  // Check if the confirm password matches the original password
  if (confirmPassword !== password) {
    return "Confirm password does not match the password.";
  }
  return null; // Passwords match
};

export { matchPassword };

const isValidPhoneNumber = (input) => {
  // Check if the phone number is provided (required)
  if (!input) {
    return null;
  }

  // Regular expression to validate phone numbers
  const phoneRegex = /^\+?[6-9]\d{9,14}$/;

  // Test the input phone number against the regex pattern
  if (!phoneRegex.test(input)) {
    return "should be 10-15 digits long including the STD code.";
  }

  return null; // Valid phone number
};

export { isValidPhoneNumber };


const isValidAccountNumber = (
  fieldName,
  accountNumber,
  confirmAccountNumber,
) => {
  // console.log(fieldName, accountNumber, confirmAccountNumber,);

  // If the account number is not provided, allow empty input (no error)
  if (!accountNumber) {
    return null;
  }

  // If account number is provided but confirm account number is missing, return error
  if (accountNumber && !confirmAccountNumber) {
    // console.log("ac", accountNumber);
    // console.log("cf:", confirmAccountNumber);

    // console.log("kkkkkkkk");
    // console.log("fieldName:", fieldName);

    return `${fieldName} error: Both account number and confirm account number are required.`;
  }

  if (!accountNumber && confirmAccountNumber) {
    return `${fieldName} error : Please enter your accountNumber for this confirm-account-number.`;
  }

  // Regular expression to validate account numbers:
  // - Only numeric characters
  // - Length between 10 and 15 digits (adjustable as per your requirements)
  const accountNumberRegex = /^\d{8,18}$/;

  // Validate the account number against the regex pattern
  if (!accountNumberRegex.test(accountNumber)) {
    return `${fieldName} error: must be between 8 and 18 digits long and contain only numbers.`;
  }

  // Check if the account number matches the confirm account number
  if (accountNumber !== confirmAccountNumber) {
    return `${fieldName} error: Account number and confirm account number do not match.`;
  }

  return null; // Valid account numbers
};

export { isValidAccountNumber };

const sortAccountsByTimezoneDesc = (accounts) => {
  return accounts.sort((a, b) => {
    const aDate = new Date(a.createdAt).toISOString();
    const bDate = new Date(b.createdAt).toISOString();

    // Extract the timezone part (e.g., "+00:00" or "+05:30") from the ISO string
    const aOffset = aDate.slice(aDate.indexOf("T") + 1, aDate.indexOf("Z"));
    const bOffset = bDate.slice(bDate.indexOf("T") + 1, bDate.indexOf("Z"));

    return bOffset.localeCompare(aOffset); // Sort in descending order based on the timezone offset
  });
};

export { sortAccountsByTimezoneDesc };

// Function to sort accounts in ascending order based on timezone (UTC offset)
const sortAccountsByTimezoneAsc = (accounts) => {
  return accounts.sort((a, b) => {
    const aDate = new Date(a.createdAt).toISOString();
    const bDate = new Date(b.createdAt).toISOString();

    // Extract the timezone part (e.g., "+00:00" or "+05:30") from the ISO string
    const aOffset = aDate.slice(aDate.indexOf("T") + 1, aDate.indexOf("Z"));
    const bOffset = bDate.slice(bDate.indexOf("T") + 1, bDate.indexOf("Z"));

    return aOffset.localeCompare(bOffset); // Sort in ascending order based on the timezone offset
  });
};

export { sortAccountsByTimezoneAsc };

const challanNumber = (input) => {
  if (!input) return null;

  // Updated regex to ensure at least 2 characters and at most 20 characters
  const challanNoRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s\-]{0,29}$/;
  if (!challanNoRegex.test(input)) {
    return "format is incorrect";
  }
  return null;
};
export { challanNumber };

const budgetHeadName = (input) => {
  if (!input) {
    return null;
  }
  const budgetHeadNameRegex = /^[A-Za-z\s\_\-\(\)\/\.,\&\'\'\;\:]+$/;

  if (!budgetHeadNameRegex.test(input)) {
    return "remove the forbidden symbols.";
  }
  return null;
};
export { budgetHeadName };

const customDecode = (encodedString) => {
  // Recursively decode until no more encoded characters are found
  let decodedString = encodedString;

  try {
    // Attempt to decode the string
    let decodedOnce = decodeURIComponent(decodedString);

    // If it has changed after decoding, recursively decode again
    while (decodedOnce !== decodedString) {
      decodedString = decodedOnce;
      decodedOnce = decodeURIComponent(decodedString);
    }
  } catch (e) {
    // If error occurs (like invalid encoding), return the original string
    return decodedString;
  }

  return decodedString;
};

export { customDecode };

const encodeSpecialSymbols = (input) => {
  if (typeof input === "string") {
    // If it's a direct string, encode all non-alphanumeric characters
    return input
      .split("")
      .map((char) => {
        // Encode every character except letters and numbers
        // encodeURIComponent does not encode all special symbols, so we manually handle all symbols
        if (/[^a-zA-Z0-9]/.test(char)) {
          return "%" + char.charCodeAt(0).toString(16).toUpperCase(); // Manually encode the character
        }
        return char; // Return alphanumeric characters as is
      })
      .join("");
  }

  if (typeof input === "object" && input !== null) {
    // If it's an object, recursively encode all string values
    const encodedObject = {};
    for (let key in input) {
      if (input.hasOwnProperty(key)) {
        // If the value is a string, encode it
        if (typeof input[key] === "string") {
          encodedObject[key] = input[key]
            .split("")
            .map((char) => {
              // Encode all characters except letters and numbers
              if (/[^a-zA-Z0-9]/.test(char)) {
                return "%" + char.charCodeAt(0).toString(16).toUpperCase(); // Manually encode the character
              }
              return char; // Return alphanumeric characters as is
            })
            .join("");
        } else if (typeof input[key] === "object") {
          // If it's an object, call recursively
          encodedObject[key] = encodeSpecialSymbols(input[key]);
        } else {
          // Otherwise, keep the value as is (for numbers, booleans, etc.)
          encodedObject[key] = input[key];
        }
      }
    }
    return encodedObject;
  }

  // If input is neither a string nor an object, just return it
  return input;
};

export { encodeSpecialSymbols };

export const isValidPincode = (value) => {
  const numericValue = Number(value); // Convert to number

  if (isNaN(numericValue) || !Number.isInteger(numericValue)) {
    return "must be a valid numeric value.";
  }

  if (String(value).length !== 6) {
    return "must be a 6-digit valid pincode.";
  }

  return null; // No error
};
