import mongoose from "mongoose";

export interface FeedDocument extends mongoose.Document {
  link: string;
}
