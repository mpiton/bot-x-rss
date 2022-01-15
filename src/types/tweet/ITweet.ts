import mongoose from "mongoose";

export interface TweetDocument extends mongoose.Document {
	link: string;
	pubDate: string;
	title: string;
	sended: boolean;
}
