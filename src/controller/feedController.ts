import * as feedService from "@/service/feed";
import { NextFunction, Request, Response } from "express";
import { FeedDocument } from "@/types/feed/IFeed";
import Logger from "@/utils/logger";

/**
 * Get all Feeds.
 * @param {Request} req
 * @param {Response} res
 * @param  {NextFunction} next
 * @returns {Promise<Response<{ success: boolean; data: UserDocument }> | undefined>}
 */
export const getAll = async (
	_req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<{ success: boolean; data: FeedDocument }> | undefined> => {
	try {
		const feeds = await feedService.findFeeds();
		if (feeds) {
			return res.status(200).json({
				success: true,
				data: feeds,
			});
		} else {
			Logger.error("Feeds not found.");
		}
	} catch (error) {
		Logger.error("Error :" + error.message);
		next(error);
	}
};

/**
 * Create a new Feed
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response | undefined>}
 */
export const create = async (
	req: Request,
	res: Response
): Promise<Response | undefined> => {
	try {
		const newFeed: FeedDocument | undefined = await feedService.createFeed(
			req,
			res
		);
		if (newFeed !== undefined) {
			Logger.info("Feed created");
			return res.status(201).json({ success: true, data: newFeed });
		}
	} catch (error) {
		Logger.error("Failed to create feed");
		return res.status(201).json({ success: false, error: error.message });
	}
};
