import jwt from "jsonwebtoken";
import User from "../models/userModel";
import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils/generateToken";

exports.register = expressAsyncHandler(async (req, res) => {
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

exports.login = expressAsyncHandler(async (req, res) => {
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

exports.all = expressAsyncHandler(async(req, res) => {
    const users = await User.find({});
    res.status(200).json({users});
})

exports.profile = expressAsyncHandler(async(req, res) => {
    
})
