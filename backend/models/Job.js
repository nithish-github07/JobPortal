import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        company: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        salary: {
            type: Number,
        },

        experience: {
            type: Number,
        },

        jobType: {
            type: String,
            enum: ["full-time", "part-time", "internship", "remote", "hybrid"],
            default: "full-time",
        },

        skills: [
            {type: String,}
        ],

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {timestamps: true}
);

export default mongoose.model("Job",jobSchema);