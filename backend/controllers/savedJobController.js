import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";

export const saveJob = async (req,res) => {
    try{
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }

        const alreadySaved = await SavedJob.findOne({
            user: req.user._id,
            job: jobId,
        });

        if(alreadySaved){
            return res.status(400).json({message: "Job already saved"});
        }

        const savedJob = await SavedJob.create({
            user: req.user._id,
            job: jobId,
        });

        res.status(201).json(savedJob);
    }catch(error){
        return res.status(400).json({message: "Job already saved"});
    }
};

export const getSavedJobs = async (req,res) => {
    try{
        const savedJobs = await SavedJob.find({
            user: req.user._id,
        }).populate("job");
        
        res.json(savedJobs);
    }catch(error){
        res.status(500).json({ message: "Error fetching saved jobs" });
    }
};

export const removeSavedJob = async (req,res) => {
    try{
        const jobId = req.params.jobId;

        await SavedJob.findOneAndDelete({
            user: req.user._id,
            job: jobId,
        });

        res.json({message: "Saved job removed"});
    }catch(error){
        res.status(500).json({ message: "Error removing saved job" });
    }
}