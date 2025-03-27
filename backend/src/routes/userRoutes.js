// Global Imports
import express from "express";

// Local Imports
import { isAuth, isAdmin } from "../handlers/tokenHandler.js";
import {register, login, profile, getAll, getOne, update, deleteUser} from '../controllers/user.js'

const userRouter = express.Router();

userRouter.post("/signup", register);

userRouter.post("/signin", login);

userRouter.put("/profile", isAuth, profile);

userRouter.get("/", isAuth, isAdmin, getAll);

userRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  getOne
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  update
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  deleteUser
);



export default userRouter;
