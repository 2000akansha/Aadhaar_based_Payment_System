import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        activityType: { type: String, required: true },  // 'login', 'logout', etc.
        details: { type: Object, default: {} },           // Store additional info (IP, device, etc.)
        timestamp: { type: Date, default: Date.now },     // Timestamp of the activity
    },
    { timestamps: true }
);
const Log = mongoose.model('Log', logSchema);
export default Log;
