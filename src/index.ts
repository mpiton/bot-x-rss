// ! Don't convert require into import
require("module-alias/register");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moduleAlias = require("module-alias");
moduleAlias.addAlias("@", __dirname);

import axios from "axios";
import cron from "node-cron";
import { createApp } from "./app";
import CONFIG from "./config";
import { connect } from "./db/db";
import { startServer } from "./server";
import Logger from "./utils/logger";

const PORT = CONFIG.APP.PORT;

if (process.env.NODE_ENV !== "test") {
  const app = createApp();
  startServer(app);
  connect();
}

cron.schedule("*/30 * * * *", async () => {
  try {
    await axios.post(`http://localhost:${PORT}/tweet/create`);
    await axios.post(`http://localhost:${PORT}/tweet`);
  } catch (error) {
    Logger.error(error.message);
  }
});
