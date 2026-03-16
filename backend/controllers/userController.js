import User from "../models/User.js";

export const getProfile = async(req,res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.json(user);
    }catch(error){
        res.status(500).json({message: "Error fetching profile"});
    }
    
};

export const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;

    const updatedUser = await user.save();

    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const uploadResume = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(!req.file){
      return res.status(400).json({message: "No file uploaded"});
    }

    user.resumeUrl = req.file.secure_url || req.file.url || req.file.path;

    await user.save();

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: user.resumeUrl
    });

  } catch (error) {
    res.status(500).json({ message: "Error uploading resume" });
  }
};

export const deleteAccount = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({
      message: "Account deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting account" });
  }
};