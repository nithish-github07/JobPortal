import express from "express";
import { saveJob, getSavedJobs, removeSavedJob} from "../controllers/savedJobController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:jobId",authMiddleware,authorizeRoles("jobSeeker"),saveJob);
router.get("/",authMiddleware,authorizeRoles("jobSeeker"),getSavedJobs);
router.delete("/:jobId",authMiddleware,authorizeRoles("jobSeeker"),removeSavedJob);

export default router;