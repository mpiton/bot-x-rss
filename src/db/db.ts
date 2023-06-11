import mongoose from "mongoose";
import { env } from "process";

// mongodb connection
export const connect = (): void => {
  if (env.DB_HOST) {
    const mongoDb = env.DB_HOST;
    mongoose
      .connect(mongoDb)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB", error.message);
      });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB Connection error"));
  }
};
