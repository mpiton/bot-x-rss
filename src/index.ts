// ! Don't convert require into import
require("module-alias/register");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moduleAlias = require("module-alias");
moduleAlias.addAlias("@", __dirname);

import { createApp } from "./app";
import { startServer } from "./server";
import { connect } from "./db/db";
import axios from "axios";
import cron from "node-cron";
import Logger from "./utils/logger";

if (process.env.NODE_ENV !== "test") {
	const app = createApp();
	startServer(app);
	connect();
}

cron.schedule("*/30 * * * *", async () => {
	try {
		await axios.post("http://localhost:8080/tweet/create");
		await axios.post("http://localhost:8080/tweet");
	} catch (error) {
		Logger.error(error.message);
	}
});
