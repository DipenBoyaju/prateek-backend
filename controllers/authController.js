import User from "../models/user.js";
import { createToken } from "../utils/jwt.js";


export const AdminSignup = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin already exists" })
    }

    const { email, password } = req.body;
    const username = email.split('@')[0];
    const user = new User({ email, password, username, role: "admin" });

    await user.save();

    const token = createToken(user._id)
    res.cookie("token", token, { httpOnly: true }).status(201).json({ message: "Admin created" })

  } catch (error) {
    console.error("Admin Signup Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack
    });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken(user._id);

    res.cookie("token", token, { httpOnly: true }).status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
