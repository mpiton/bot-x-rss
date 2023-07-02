import Feed from "@/models/Feed";
import { FeedDocument } from "@/types/feed/IFeed";
import Logger from "@/utils/logger";
import { Request, Response } from "express";
import { NOT_ACCEPTABLE } from "http-status";
import mongoose from "mongoose";

/**
 * Get All Feeds
 */
export const findFeeds = async () => {
  try {
    const feeds = await Feed.find();
    Logger.info(`Nombre de feeds: ${feeds.length}`);
    return feeds;
  } catch (error) {
    Logger.error(JSON.stringify(error));
  }
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
      title: req.body.title,
    });
    await feed.save();
    return feed;
  } catch (error) {
    res.status(NOT_ACCEPTABLE).json({ success: false, error });
  }
};
