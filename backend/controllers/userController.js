import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

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
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, {
        resource_type: "raw",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resumes",
      resource_type: "raw",
    });

    fs.unlinkSync(req.file.path);

    user.resumeUrl = result.secure_url;
    user.resumePublicId = result.public_id;

    await user.save();

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: user.resumeUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
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