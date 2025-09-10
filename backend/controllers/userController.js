import { users } from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user.id });
    return res
      .status(200)
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const adminAccess = (req, res) =>
  res.status(200).json({ message: "Only admins can access this route!" });

export const moderatorAccess = (req, res) =>
  res
    .status(200)
    .json({ message: "Only admins and moderators can access this route!" });
