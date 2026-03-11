import express from "express";
import{applyJob, getMyApplications, getJobApplicants, updateApplicationStatus, withdrawApplication} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:jobId",authMiddleware,authorizeRoles("jobSeeker"),applyJob);
router.get("/my",authMiddleware,authorizeRoles("jobSeeker"),getMyApplications);
router.get("/job/:jobId",authMiddleware,authorizeRoles("recruiter"),getJobApplicants);
router.patch("/:id/status", authMiddleware, authorizeRoles("recruiter"),updateApplicationStatus);
router.delete("/:id",authMiddleware,authorizeRoles("jobSeeker"),withdrawApplication);

export default router;