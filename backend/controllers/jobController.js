import Job from "../models/Job.js";

export const createJob = async(req,res) => {
    try{
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id,
        });

        res.status(201).json(job);
    }catch(error){
        res.status(500).json({message: "Error creating job"});
    }
};

export const getAllJobs = async(req,res) => {
    try{
        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: "i",
            },
        }
        : {};

        const location = req.query.location ? {
            location: {
                $regex: req.query.location,
                $options: "i",
            },
        }
        : {};

        const jobs = await Job.find({
            ...keyword,
            ...location,
        }).populate("postedBy", "name email");

        res.json(jobs);
    }catch(error){
        res.status(500).json({message: "Error fetching jobs"});
    }
};

export const getJobById = async(req,res) => {
    try{
        const job = await Job.findById(req.params.id).populate(
            "postedBy",
            "name email"
        );

        if(!job){
            return res.status(404).json({message: "Job not found"});
        }

        res.json(job);
    }catch(error){
        res.status(500).json({ message: "Error fetching job" });
    }
};

export const updateJob = async(req,res) => {
    try{
        const job = await Job.findById(req.params.id);

        if(!job){
            return res.status(404).json({message: "Job not found"});
        }

        if(job.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Not authorized to update this job"});
        }

        job.title = req.body.title || job.title;
        job.description = req.body.description || job.description;
        job.company = req.body.company || job.company;
        job.location = req.body.location || job.location;

        const updatedJob = await job.save();

        res.status(200).json(updatedJob);
    }catch(error){
        res.status(500).json({message: "Error updating job"});
    }
}

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
};