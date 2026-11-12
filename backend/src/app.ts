import express, { type Express } from "express";
import { isProduction } from "./utils/checkENV.js";
import morgan from "morgan";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import authRouter from "./routes/auth.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import profileRouter from "./routes/profile.route.js";
import orgRouter from "./routes/org.route.js";
import usersRouter from "./routes/users.route.js";

const app: Express = express();
app.set("trust proxy", 1);

app.use(corsMiddleware);

app.use(morgan("dev", { skip: () => isProduction() }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/organizations", orgRouter);
app.use("/api/users", usersRouter);

app.get("/", async (req, res) => {
  res.send("Hello from FixFlow");
});

app.use(errorMiddleware);

export default app;
