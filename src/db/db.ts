import mongoose from "mongoose";
import { env } from "process";

// mongodb connection
export const connect = (): void => {
	if (env.DB_HOST) {
		const mongoDb = env.DB_HOST;
		mongoose.connect(mongoDb, () => console.log("👍 MongoDB Connected 👍"));
		const db = mongoose.connection;
		db.on("error", console.error.bind(console, "MongoDB Connection error"));
	}
};
