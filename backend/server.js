import express from "express";
import "dotenv/config";

import cors from "cors";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/saved-jobs",savedJobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/user",userRoutes);

app.get("/",(req,res) => {
    res.send("Job Portal API running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});
