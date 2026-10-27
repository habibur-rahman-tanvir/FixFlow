import { createNodeRedisClient, Queue } from "bullmq";
import { redisClient } from "./redisClient.js";

const connection = createNodeRedisClient(redisClient);

const emailQueue = new Queue("email", { connection });

export { connection, emailQueue };
