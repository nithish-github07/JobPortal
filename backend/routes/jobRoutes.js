import express from "express";
import {createJob, getAllJobs, getJobById, updateJob, deleteJob} from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/",protect,authorizeRoles("recruiter"),createJob);
router.get("/",getAllJobs);
router.get("/:id",getJobById);
router.put("/:id",protect,authorizeRoles("recruiter"),updateJob);
router.delete( "/:id", protect, authorizeRoles("recruiter"), deleteJob);

export default router;