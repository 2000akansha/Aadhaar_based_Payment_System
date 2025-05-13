import mongoose from "mongoose";
const beneficiaryLogSchema = new mongoose.Schema({
    rowmaster: [{
        rowNumber: {
            type: Number,
            required: true
        },
        rowDetails: [{
            beneficiaryName: {
                type: String
            },
            beneficiaryNumber: {
                type: String
            },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            userReference: {
                type: String
            },
            settlementDate: {
                type: String
            },
            bankAccountNumber: {
                type: String
            },
            destinationBankIIN: {
                type: String
            },
            beneficiaryAadhaarNumber: {
                type: String
            },
            userCreditReference: {
                type: String
            },
            failedReason: {
                type: String
            },
            amount: {
                type: Number
            },

            beneficiaryUID: {
                type: String,
                required: true,
                default: () => {
                    const numbers = Math.floor(100000 + Math.random() * 900000); // 6-digit number
                    return `BUID-${numbers}`;
                },
                unique: true
            },
        }],
    }],

}, { timestamps: true }
);

const beneficiaryLog = mongoose.model('beneficiaryLog', beneficiaryLogSchema);

export default beneficiaryLog;