import express, { Router } from "express";
import { getUsers } from "../controller/users.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";

const usersRouter: Router = express.Router();

usersRouter.get("/", verifyAccess(), getUsers);

export default usersRouter;
