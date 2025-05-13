import express from "express";
import {
  changePassword,
  loginUser,
  signupUser,
} from "../../controllers/userTasks/user.controller.js";
import requireAuth from "../../middleware/auth.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", signupUser);
router.post("/change-password", requireAuth, changePassword);

export default router;
