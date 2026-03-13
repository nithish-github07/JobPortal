import Job from "../models/Job.js";
import Application from "../models/Application.js";
import SavedJob from "../models/SavedJob.js";

//Recruiter Dashboard

export const recruiterStats = async (req,res) => {
    try{
        const recruiterId = req.user._id;

        const jobs = await Job.find({postedBy: recruiterId});

        const jobIds = jobs.map(job => job._id);

        const totalApplications = await Application.countDocuments({
            job: {$in: jobIds}
        });

        const acceptedApplications = await Application.countDocuments({
            job: { $in: jobIds },
            status: "accepted"
        });

        res.json({
            totalJobs: jobs.length,
            totalApplications,
            acceptedApplications
        });
    }catch(error){
        res.status(500).json({ message: "Error fetching recruiter stats" });
    }
}
export const recentApplications = async (req,res) => {
    try{
        const recruiterId = req.user._id;

        const jobs = await Job.find({postedBy: recruiterId});
        
        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({
            job: {$in: jobIds}
        })
            .populate("applicant","name email")
            .populate("job","title company")
            .sort({createdAt: -1})
            .limit(5);

        res.json(applications);
    }catch(error){
        res.status(500).json({ message: "Error fetching recent applications" });
    }
};

export const userStats = async (req, res) => {
  try {

    const userId = req.user._id;

    const totalApplications = await Application.countDocuments({
      applicant: userId
    });

    const pending = await Application.countDocuments({
      applicant: userId,
      status: "pending"
    });

    const accepted = await Application.countDocuments({
      applicant: userId,
      status: "accepted"
    });

    const rejected = await Application.countDocuments({
      applicant: userId,
      status: "rejected"
    });

    res.json({
      totalApplications,
      pending,
      accepted,
      rejected
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

