import * as feedService from "@/service/feed";
import { Request, Response } from "express";
import { FeedDocument } from "@/types/feed/IFeed";
import Logger from "@/utils/logger";

/**
 * Get all Feeds.
 * @returns {Promise<FeedDocument[] | void>}
 */
export const getAll = async (): Promise<FeedDocument[] | void> => {
	try {
		await feedService.findFeeds();
		return;
	} catch (error) {
		Logger.info(error.message);
	}
};

/**
 * Create a new Feed
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const create = async (req: Request, res: Response): Promise<void> => {
	try {
		const newFeed: FeedDocument | undefined = await feedService.createFeed(
			req,
			res
		);
		if (newFeed !== undefined) {
			Logger.info("Feed created");
		}
	} catch (error) {
		Logger.error("Failed to create feed");
	}
};
