import express, { Router } from "express";
import { getUsers } from "../controller/users.controller.js";

const usersRouter: Router = express.Router();

usersRouter.get("/", getUsers);

export default usersRouter;
