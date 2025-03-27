import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const decodeToken = (req) => {
  const authorization = req.headers.authorization;
  const bearer = authorization.split(" ")[1]; // Bearer XXXXXX --> it will ignore Bearer
  try {
    if (bearer) {
      const decodedToken = jwt.verify(bearer, process.env.JWT_SECRET);
      return decodedToken;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const isAuth = async (req, res, next) => {
  const decodedToken = decodeToken(req);
  if (!decodedToken) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    const user = await User.findById(decodedToken._id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(404).send({ message: "Invalid Admin Token" });
  }
};
