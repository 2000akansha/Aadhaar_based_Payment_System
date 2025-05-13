import mongoose from "mongoose";
const graphSchema = new mongoose.Schema({
    year: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    stocks: {
        type: String,

    },
    tBills: {
        type: Number
    },
    tBonds: {
        type: String
    },

    beneficiaryUID: {
        type: String,
        required: true,
        default: () => {
            const numbers = Math.floor(100000 + Math.random() * 900000); // 6-digit number
            return `B-UID-${numbers}`;
        },
        unique: true
    },
}, { timestamps: true });

const graph = new mongoose.model('graph', graphSchema);
export default graph;


