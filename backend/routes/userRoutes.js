import express from "express";
import{ getProfile, updateProfile, uploadResume, deleteAccount } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile",authMiddleware,getProfile);
router.put("/profile",authMiddleware,updateProfile);
router.post("/resume",upload.single("resume"),authMiddleware,uploadResume);
router.delete("/account",authMiddleware,deleteAccount);

export default router;
