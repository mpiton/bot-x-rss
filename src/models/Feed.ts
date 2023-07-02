import { FeedDocument } from "@/types/feed/IFeed";
import mongoose from "mongoose";

const FeedSchema = new mongoose.Schema(
	{
		_id: { type: String },
		link: { type: String, required: true },
	},
	{ timestamps: true }
);

const Feed = mongoose.model<FeedDocument>("Feed", FeedSchema);

export default Feed;
