import { TweetDocument } from "@/types/tweet/ITweet";
import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    _id: { type: String },
    link: { type: String, required: true },
    pubDate: { type: String, required: true },
    title: { type: String, required: true },
    sended: { type: Boolean, required: true, default: false },
    expire_at: { type: Date, default: Date.now, expires: 604800 }, // delete this document after 7 jours
  },
  { timestamps: true }
);

const Tweet = mongoose.model<TweetDocument>("Tweet", TweetSchema);

export default Tweet;
