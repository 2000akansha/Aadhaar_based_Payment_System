import path, { dirname } from "path";
import fs from "fs";
import ExcelJS from "exceljs";
import sanitize from "sanitize-html";
import xlsx from "xlsx";
import beneficiary from "../../models/beneficiary/beneficiary.js";
import { fileURLToPath } from "url";
import graph from "../../models/frontendGraphTesting/graph.js";
import beneficiaryLog from "../../models/beneficiary/beneficiaryLog.js";
import {sanitizeExcelValue} from "../../utils/helperfunctions.js";
import { error } from "console";



// These lines recreate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadExcel = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const userId = req.user.id;
    const filePath = path.resolve("uploads", req.file.filename);

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const processedRows = new Set();
        const beneficiaryData = [];

        // New Workbook for output
        const outputWorkbook = new ExcelJS.Workbook();
        const outputSheet = outputWorkbook.addWorksheet('Formatted Data');

        // Header Row
        outputSheet.addRow([
            'User Number', 'User Name', 'User Reference', 'Settlement Date (DDMMYYYY)',
            "User's Bank Account Number", 'Destination Bank IIN', 'Beneficiary Aadhaar Number',
            'User Credit Reference', 'Amount'
        ]);

        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            const beneficiaryNumber = sanitizeExcelValue(row.getCell(1).value);
            const beneficiaryName = sanitizeExcelValue(row.getCell(2).value);
            const userReference = sanitizeExcelValue(row.getCell(3).value);
            const settlementDate = sanitizeExcelValue(row.getCell(4).value);
            const bankAccountNumber = sanitizeExcelValue(row.getCell(5).value);
            const destinationBankIIN = sanitizeExcelValue(row.getCell(6).value);
            const beneficiaryAadhaarNumber = sanitizeExcelValue(row.getCell(7).value);
            const userCreditReference = sanitizeExcelValue(row.getCell(8).value);
            const amount = sanitizeExcelValue(row.getCell(9).value);

            let failedReason = "";

            // Validate required fields
            if (
                !beneficiaryNumber || !beneficiaryName || !userReference ||
                !settlementDate ||  !beneficiaryAadhaarNumber || !userCreditReference || isNaN(amount)
            ) {
                failedReason = "Missing or invalid required fields";
            }

            const rowKey = `${userReference}-${userCreditReference}`;
            if (processedRows.has(rowKey)) {
                failedReason = "Duplicate row based on userReference and userCreditReference";
            }
console.log("rowKey", rowKey);

            if (failedReason) {
                const logRowDetails = {
                    beneficiaryNumber,
                    beneficiaryName,
                    userReference,
                    settlementDate,
                    bankAccountNumber,
                    destinationBankIIN,
                    beneficiaryAadhaarNumber,
                    userCreditReference,
                    amount,
                    uploadedBy: userId,
                    failedReason, // <- fix: assign the actual string
                };

                await beneficiaryLog.create({
                    rowmaster: [{
                        rowNumber,
                        rowDetails: [logRowDetails]
                    }]
                });

                continue; // skip this row
            }

            // Mark this unique combo as processed
            processedRows.add(rowKey);

            const beneficiaryList = await beneficiary.create({
                beneficiaryNumber,
                beneficiaryName,
                userReference,
                settlementDate,
                bankAccountNumber,
                destinationBankIIN,
                beneficiaryAadhaarNumber,
                userCreditReference,
                amount,
                uploadedBy: userId,
            });

            beneficiaryData.push(beneficiaryList);

            outputSheet.addRow([
                beneficiaryNumber,
                beneficiaryName,
                userReference,
                settlementDate,
                bankAccountNumber,
                destinationBankIIN,
                beneficiaryAadhaarNumber,
                userCreditReference,
                amount
            ]);
        }

        const exportFileName = `ABP_RequestFile_${Date.now()}.xlsx`;
        const exportPath = path.resolve(__dirname, '..', '..', 'nachfiles', 'requestFiles', exportFileName);
        await outputWorkbook.xlsx.writeFile(exportPath);

        return res.status(200).json({
            success: true,
            message: "Beneficiaries uploaded and Excel generated successfully.",
            generatedExcel: exportFileName,
            beneficiaryData
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process the uploaded Excel file.",
            error: error.message,
        });
    }
};



export const deleteInsertedExcelData = async (req, res) => {
    const { villageId } = req.body;
    const userId = req.user.id; // Assuming user ID is extracted from auth middleware

    try {
        // Validate villageId
        if (!villageId) {
            return res.status(400).json({
                success: false,
                message: "Village ID is required.",
            });
        }

        // Delete data from each collection associated with the village and user
        const landPriceResult = await LandPrice.deleteMany({
            villageId,
            "update.userId": userId,
        });
        const khatauniDetailsResult = await KhatauniDetails.deleteMany({
            villageId,
            "update.userId": userId,
        });
        const beneficiaryResult = await BENEFICIARY.deleteMany({
            villageId,
            "update.userId": userId,
        });
        const beneficiaryDisbursementResult =
            await BeneficiaryDisbursementDetails.deleteMany({
                villageId,
                "update.userId": userId,
            });
        const oldBeneficiaryDisbursementResult =
            await OldBeneficiaryDisbursement.deleteMany({
                villageId,
                "update.userId": userId,
            });

        // Reset VillageList fields to zero or defaults after deletion
        const villageResetResult = await VillageList.findOneAndUpdate(
            { _id: villageId },
            {
                $set: {
                    khatauni: 0,
                    totalBeneficiaries: 0,
                    pendingDocumentsBeneficiaries: 0,
                    totalCompensation: 0,
                    totalCourtCases: 0,
                    villageArea: "0",
                    landPriceId: null,
                    update: { userId, updatedAt: new Date(), action: "0" },
                },
            },
            { new: true }
        );

        // Send response with the delete count for each collection and reset confirmation
        res.status(200).json({
            success: true,
            message: "Data deleted and VillageList fields reset successfully.",
            deletedRecords: {
                landPrice: landPriceResult.deletedCount,
                khatauniDetails: khatauniDetailsResult.deletedCount,
                beneficiary: beneficiaryResult.deletedCount,
                beneficiaryDisbursementDetails:
                    beneficiaryDisbursementResult.deletedCount,
                oldBeneficiaryDisbursement:
                    oldBeneficiaryDisbursementResult.deletedCount,
            },
            villageReset: villageResetResult,
        });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting data.",
            error: error.message,
        });
    }
};








export const uploadGraphSheet = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const userId = req.user.id;
    const filePath = path.resolve("uploads", req.file.filename);

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const beneficiaryData = [];

        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            const sanitize = (val) => (val ? String(val).trim() : "");

            const year = sanitize(row.getCell(1).value);
            const stocks = sanitize(row.getCell(2).value);
            const tBills = sanitize(row.getCell(3).value);
            const tBonds = sanitize(row.getCell(4).value);

            if (!year || !stocks || !tBills || !tBonds) {
                console.log(`Skipping row ${rowNumber} due to missing fields`);
                continue;
            }

            try {
                const saved = await graph.create({
                    year, stocks, tBills, tBonds,
                    uploadedBy: userId,
                });
                beneficiaryData.push(saved);
                console.log(`Saved row ${rowNumber}`);
            } catch (err) {
                console.error(`Failed to save row ${rowNumber}:`, err.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Beneficiaries uploaded successfully.",
            beneficiaryData
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process the uploaded Excel file.",
            error: error.message,
        });
    }
};
