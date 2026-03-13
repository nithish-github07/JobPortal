import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyJob = async(req,res) => {
    try{
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }

        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if(alreadyApplied){
            return res.status(400).json({message: "You already applied"});
        }

        if(req.user.role != "jobSeeker"){
            return res.status(403).json({message: "Only jobSeekers can apply"});
        }
        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
        });


        res.status(201).json(application);
    }catch(error){
        res.status(500).json({message: "Error applying for job"});
    }
};

export const getMyApplications = async(req,res) => {
    try{
        const applications = await Application.find({
            applicant: req.user._id,
        }).populate("job");

        res.json(applications);
    }catch(error){
        res.status(500).json({message: "Error fetching applications"});
    }
};

export const getJobApplicants = async(req,res) => {
    try{
        const jobId = req.params.jobId;

        const applications = await Application.find({
            job: jobId,
        }).populate("applicant", "name email");

        res.json(applications);
    } catch(error){
        res.status(500).json({message: "Error fetching applicants"});
    }
};

export const updateApplicationStatus = async(req,res) => {
    try{
        const {status} = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const application = await Application.findById(req.params.id).populate("job");

        if(!application){
            return res.status(404).json({message: "Application not found"});
        }

        if(application.job.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Not authorized"});
        }

        application.status = status;

        await application.save();

        res.json({message: "Application status updated", application});
    }catch(error){
        res.status(500).json({message: "Error updating status"});
    }
};

export const withdrawApplication = async(req,res) => {
    try{
        const application = await Application.findById(req.params.id);

        if(!application){
            return res.status(404).json({ message: "Application not found" });
        }

        if(application.applicant.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Not authorized"});
        }

        await application.deleteOne();

        res.json({message: "Application withdrawn successfully"});
    }catch(error){
        res.status(500).json({message: "Error withdrawing application"});
    }
};