import express, { type Express } from "express";
import { isProduction } from "./utils/checkENV.js";
import morgan from "morgan";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import authRouter from "./routes/auth.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { sendMail, type MailProps } from "./modules/email/email.module.js";
// import { emailQueue } from "./config/queue.js";

const app: Express = express();
app.set("trust proxy", 1);

app.use(corsMiddleware);

app.use(morgan("dev", { skip: () => isProduction() }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.post("/send-mail", async (req, res) => {
  const { subject, to, text }: MailProps = req.body;
  const result = await sendMail({ subject, to, text });
  res.json(result);
});

app.get("/", async (req, res) => {
  res.send("Hello from FixFlow");
});

app.use(errorMiddleware);

export default app;
