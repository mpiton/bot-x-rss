import Feed from "@/models/Feed";
import { FeedDocument } from "@/types/feed/IFeed";
import { NOT_ACCEPTABLE } from "http-status";
import mongoose from "mongoose";
import { Request, Response } from "express";

/**
 * Get All Feeds
 * @returns {Promise<FeedDocument[]>}
 */
export const findFeeds = async (): Promise<FeedDocument[]> => {
	return Promise.resolve(Feed.find());
};

/**
 * Creation of the feed
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<FeedDocument | undefined>}
 */
export const createFeed = async (
	req: Request,
	res: Response
): Promise<FeedDocument | undefined> => {
	try {
		//Register Feed
		const feed = new Feed({
			_id: new mongoose.Types.ObjectId(),
			link: req.body.link,
		});
		await feed.save();
		return feed;
	} catch (error) {
		res.status(NOT_ACCEPTABLE).json({ success: false, error: error });
	}
};
