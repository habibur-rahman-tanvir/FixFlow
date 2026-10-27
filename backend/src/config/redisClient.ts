import { createClient } from "redis";
import { envERROR } from "../utils/checkENV.js";

const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = envERROR({
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
});

const redisClient = createClient({
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT, 10),
  },
});

// redisClient.on("error", (err) => console.error("Redis Client Error:", err));
// redisClient.on("connect", () => console.log("Successfully connected to Redis"));

// redisClient.connect().catch(console.error);

export { redisClient };
