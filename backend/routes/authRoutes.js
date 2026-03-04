import express from "express";
import {registerUser, loginUser} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login", loginUser);
router.get("/me",protect,(req,res)=> {
    res.json(req.user);
});

export default router;