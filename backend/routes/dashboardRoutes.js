import express from "express";
import { recruiterStats, recentApplications, userStats } from "../controllers/dashboardController.js";
import { getSavedJobs } from "../controllers/savedJobController.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recruiter/stats",authMiddleware,authorizeRoles("recruiter"),recruiterStats);
router.get("/recruiter/recent-applications",authMiddleware,authorizeRoles("recruiter"),recentApplications);
router.get("/user/stats",authMiddleware,authorizeRoles("jobSeeker"),userStats);
router.get("/user/saved-jobs",authMiddleware,authorizeRoles("jobSeeker"),getSavedJobs);

export default router;