import express, { Router } from "express";

const authRouter: Router = express.Router();

authRouter.post("/login", async (req, res) => {
  res.send("Login");
});

export default authRouter;
