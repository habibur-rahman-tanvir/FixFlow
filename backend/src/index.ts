import app from "./app.js";
import { isProduction } from "./utils/checkENV.js";
import { getESMPaths } from "./utils/esmPath.js";
import path from "path";
import fs from "fs";
import https from "https";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 8000;

if (isProduction()) {
  app.listen(PORT, () => {
    // console.log(`Server(production) running (http://localhost:${PORT}) ....`);
  });
} else {
  const { __dirname } = getESMPaths(import.meta.url);
  const key = await fs.readFileSync(
    path.join(__dirname, "./certificates/localhost-key.pem"),
  );
  const cert = await fs.readFileSync(
    path.join(__dirname, "./certificates/localhost.pem"),
  );
  https.createServer({ key, cert }, app).listen(PORT, () => {
    logger.info(`Server(development) running at https://localhost:${PORT}`);
  });
}
