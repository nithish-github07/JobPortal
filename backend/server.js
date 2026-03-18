import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 100,
    message: {
        message: "Too many requests, please try again later",
    },
});

app.use("/api",limiter);
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

export default app;