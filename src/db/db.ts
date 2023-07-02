import Logger from "@/utils/logger";
import mongoose from "mongoose";
import { env } from "process";

// mongodb connection
export const connect = (): void => {
	if (!env.DB_HOST) {
		Logger.error(
			"No MongoDB connection string. Set MONGODB_URI environment variable."
		);
		return;
	}
	const mongoDb = env.DB_HOST;
	mongoose
		.connect(mongoDb)
		.then(() => {
			Logger.info("Connected to MongoDB");
		})
		.catch((error) => {
			Logger.error("MongoDB connection error: ", error);
			process.exit(1);
		});
	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "MongoDB Connection error"));
};
