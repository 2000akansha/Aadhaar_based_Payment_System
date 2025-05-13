import mongoose from "mongoose";
const beneficiarySchema = new mongoose.Schema({
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
        type: String,
        // unique:true
    },

    paymentStatus: {
        type: String,
        enum: ["0", "1", "2"],
        default: "0"
    },
    reason: {
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
}, { timestamps: true });

const beneficiary = new mongoose.model('beneficiary', beneficiarySchema);
export default beneficiary;


