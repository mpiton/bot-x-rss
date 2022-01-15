import mongoose from "mongoose";
import { TweetDocument } from "@/types/tweet/ITweet";

const TweetSchema = new mongoose.Schema(
	{
		_id: { type: String },
		link: { type: String, required: true },
		pubDate: { type: String, required: true },
		title: { type: String, required: true },
		sended: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

const Tweet = mongoose.model<TweetDocument>("Tweet", TweetSchema);

export default Tweet;
