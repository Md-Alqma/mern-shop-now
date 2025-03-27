import bcrypt from "bcryptjs";

import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils/generateToken.js";
import User from "../models/userModel.js";

export const register = expressAsyncHandler(async (req, res) => {
  const { password } = req.body;

  try {
    req.body.password = bcrypt.hashSync(password);
    const newUser = await User.create(req.body);
    const token = generateToken(newUser._id);
    res.status(201).json({ newUser, token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("password email name");
    if (!user)
      return res.status(403).json({ error: "Invalid email or password" });
    if (!bcrypt.compareSync(password, user.password))
      return res.status(403).json({ error: "Invalid email or password" });
    user.password = undefined;
    const token = generateToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export const profile = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = bcrypt.hashSync(password, 8);
    }
    const updatedUser = await user.save();
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export const getOne = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export const getAll = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ users });
});

export const update = expressAsyncHandler(async (req, res) => {
  const { name, email, isAdmin } = req.body;
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = Boolean(isAdmin);

    const updatedUser = await user.save();
    res.status(204).json({message: "User updated", user: updatedUser});
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
  const {userId} = req.params;
  try {
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({error: 'User not found'});
    if(user.email === 'admin@example.com') return res.status(400).json({message: "Can not delete admin user"});
    await user.deleteOne();
    res.status(200).json({message: "User deleted"});
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
})
