import { body, param, query, validationResult } from "express-validator";
import { disallowMaliciousCode } from "../utils/helperfunctions.js";

// **Reusable validation functions**
const isAlphaSpace = (field) =>
  body(field)
    .optional()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(`${field} should only contain alphabets and spaces.`);

const isNumeric = (field) =>
  body(field)
    .optional()
    .isNumeric()
    .withMessage(`${field} should be a numeric value.`);

const isAlphanumeric = (field) =>
  body(field)
    .optional()
    .isAlphanumeric()
    .withMessage(`${field} should be alphanumeric.`);

const isValidEnum = (field, enumValues) =>
  body(field)
    .optional()
    .isIn(enumValues)
    .withMessage(`${field} must be one of ${enumValues.join(", ")}.`);

const isValidMongoId = (field) =>
  body(field)
    .optional()
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId.`);

const isValidDate = (field) =>
  body(field)
    .optional()
    .isISO8601()
    .withMessage(`${field} must be a valid date in YYYY-MM-DD format.`);

// **Reusable function to validate structured data dynamically**
const validateStructuredObject = (parentKey, fieldValidations) => {
  return [
    body(parentKey).isObject().withMessage(`${parentKey} must be an object.`),
    ...fieldValidations.map((validation) => validation(parentKey)),
  ];
};

// **Validation logic for different update APIs**
const fieldValidations = {
  bill: (parentKey) => [
    isNumeric(`${parentKey}.carpetAreaSqmtrTo`),
    isNumeric(`${parentKey}.carpetAreaSqmtrFrom`),
    isNumeric(`${parentKey}.propertyFloors`),
    isAlphanumeric(`${parentKey}.propertyType`),
    isAlphaSpace(`${parentKey}.propertyLocation`),
    isNumeric(`${parentKey}.price`),
    isValidDate(`${parentKey}.propertyCreationDate`),
    isNumeric(`${parentKey}.ageFactorPercentage`),
    isNumeric(`${parentKey}.useCategoryFactorPercentage`),
    isAlphanumeric(`${parentKey}.constructionType`),
    isNumeric(`${parentKey}.constructionFactorPercentage`),
    isAlphanumeric(`${parentKey}.occupancyType`),
    isNumeric(`${parentKey}.occupancyFactorPercentage`),
    isValidEnum(`${parentKey}.status`, ["active", "inactive"]),
  ],
  mohalla: (parentKey) => [
    isAlphaSpace(`${parentKey}.mohallaName`),
    isValidMongoId(`${parentKey}.zoneMasterId`),
    isValidMongoId(`${parentKey}.wardMasterId`),
    isNumeric(`${parentKey}.streetCount`),
    isAlphanumeric(`${parentKey}.areaSize`),
    isAlphaSpace(`${parentKey}.landmark`),
    isAlphaSpace(`${parentKey}.mohallaInchargeName`),
    isValidEnum(`${parentKey}.status`, ["0", "1"]),
  ],
  penalty: (parentKey) => [
    isValidDate(`${parentKey}.penaltyStartDate`),
    isNumeric(`${parentKey}.penaltyGracePeriod`),
    isNumeric(`${parentKey}.interestOnPenalty`),
    isAlphanumeric(`${parentKey}.billingCycle`),
    isAlphaSpace(`${parentKey}.discountCategory`),
    isNumeric(`${parentKey}.discountPercentage`),
    isNumeric(`${parentKey}.discountFlat`),
    isValidEnum(`${parentKey}.status`, ["active", "inactive"]),
  ],
  ward: (parentKey) => [
    isValidMongoId(`${parentKey}.zoneMasterId`),
    isAlphaSpace(`${parentKey}.wardName`),
    isAlphanumeric(`${parentKey}.wardCode`),
    isAlphanumeric(`${parentKey}.areaSize`),
    isNumeric(`${parentKey}.wardPhoneNumber`),
    isAlphaSpace(`${parentKey}.wardInchargeName`),
    isValidEnum(`${parentKey}.status`, ["0", "1"]),
  ],
};

// **Middleware to validate any update API dynamically**
export const processDynamicDataValidation = (
  entityType,
  newDataKey,
  previousDataKey,
) => {
  if (!fieldValidations[entityType]) {
    throw new Error(`No validation rules found for entity: ${entityType}`);
  }
  return [
    ...validateStructuredObject(newDataKey, fieldValidations[entityType]),
    ...validateStructuredObject(previousDataKey, fieldValidations[entityType]),
  ];
};

// **Middleware to check for errors**
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for malicious content dynamically
    let maliciousErrors = [];
    Object.keys(req.body).forEach((parentKey) => {
      let nestedObject = req.body[parentKey];

      if (typeof nestedObject === "object" && nestedObject !== null) {
        Object.keys(nestedObject).forEach((field) => {
          if (typeof nestedObject[field] === "string") {
            const isMalicious = disallowMaliciousCode(nestedObject[field]);
            if (isMalicious) {
              maliciousErrors.push({
                field: `${parentKey}.${field}`,
                error: `${parentKey}.${field} contains malicious content`,
              });
            }
          }
        });
      }
    });

    if (maliciousErrors.length > 0) {
      return res.status(400).json({ status: "error", errors: maliciousErrors });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  };
};

// Static Validation Rules
export const validateRequestBody = [
  isAlphaSpace("fullName"),
  isAlphaSpace("fatherOrHusbandName"),
  isAlphaSpace("zoneInchargeName"),
  isAlphaSpace("username"),
  isAlphanumeric("location"),
  isAlphanumeric("address"),
  isAlphanumeric("designation"),
  isAlphanumeric("houseNumber"),
  isNumeric("carpetAreaSqmtrTo"),
  isNumeric("carpetAreaSqmtrFrom"),
  isNumeric("penaltyAmount"),
  isValidEnum("propertyType", ["Residential", "Commercial"]),
  isValidEnum("constructionType", ["Concrete", "Brick", "Wood"]),
  isValidEnum("occupancyType", ["Owner", "Tenant"]),
  isValidEnum("status", ["Active", "Inactive"]),
];

// Query and Param Validation
export const validateParams = [
  param("id").isMongoId().withMessage("Invalid MongoDB ObjectId."),
];

export const validateQueryParams = [
  query("search").optional().isString().withMessage("Search must be a string."),
];

// Middleware for dynamic validation
export const validateDynamicUpdate = async (req, res, next) => {
  let validations = [];

  // Iterate through the dynamic top-level keys
  Object.keys(req.body).forEach((parentKey) => {
    let nestedObject = req.body[parentKey];

    // Ensure the nested value is an object before processing
    if (typeof nestedObject === "object" && nestedObject !== null) {
      Object.entries(nestedObject).forEach(([field, value]) => {
        validations.push(getValidationRule(parentKey, field, value));
      });
    }
  });

  // Run validations dynamically
  await Promise.all(validations.map((validation) => validation.run(req)));

  // Final validation error check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }

  next();
};

// Dynamic Validation Rule Generator
const getValidationRule = (parentKey, field, value) => {
  let fieldPath = `${parentKey}.${field}`;

  if (typeof value === "string") {
    if (/^[A-Za-z\s]+$/.test(value)) {
      return body(fieldPath)
        .optional()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage(`${fieldPath} should only contain alphabets and spaces.`);
    }

    if (/^\d+$/.test(value)) {
      return body(fieldPath)
        .optional()
        .isNumeric()
        .withMessage(`${fieldPath} should be a numeric value.`);
    }

    if (/^\w+$/.test(value)) {
      return body(fieldPath)
        .optional()
        .isAlphanumeric()
        .withMessage(`${fieldPath} should be alphanumeric.`);
    }
  }

  if (Array.isArray(value)) {
    return body(fieldPath)
      .optional()
      .isArray()
      .withMessage(`${fieldPath} should be an array.`);
  }

  if (typeof value === "boolean") {
    return body(fieldPath)
      .optional()
      .isBoolean()
      .withMessage(`${fieldPath} should be true or false.`);
  }

  return body(fieldPath)
    .optional()
    .isString()
    .withMessage(`${fieldPath} should be a string.`);
};
