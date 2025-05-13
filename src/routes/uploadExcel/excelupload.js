import express from "express";
import {
    uploadExcel, uploadGraphSheet
} from "../../controllers/excelUpload/upload.js";
import requireAuth from "../../middleware/auth.js";
import upload from "../../middleware/multer.js";
const router = express.Router();

router.post("/upload-excel", requireAuth, upload.single("file"), uploadExcel
);

router.post("/upload-graph", requireAuth, upload.single("file"), uploadGraphSheet
);
export default router;
