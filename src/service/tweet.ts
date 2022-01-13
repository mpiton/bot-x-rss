import { NOT_ACCEPTABLE } from "http-status";
import mongoose from "mongoose";
import { Response, Request } from "express";
import Tweet from "@/models/Tweet";
import { TweetDocument } from "@/types/tweet/ITweet";
import { env } from "process";
import { TwitterApi } from "twitter-api-v2";

/**
 * Creation of the tweet
 * @param {{link: string, pubDate: string, sended: boolean}} data
 * @param {Response} res
 * @returns {Promise<TweetDocument | undefined>}
 */
export const createTweet = async (
	data: { link: string; pubDate: string; sended: boolean },
	res: Response
): Promise<TweetDocument | undefined> => {
	try {
		//Recherche si le tweet existe
		const searchTweet = await Tweet.find({ link: data.link });
		//S'il n'existe pas alors je crée
		if (searchTweet.find((elem) => elem.link === data.link) === undefined) {
			//Register Tweet
			const tweet = new Tweet({
				_id: new mongoose.Types.ObjectId(),
				link: data.link,
				pubDate: data.pubDate,
				sended: data.sended,
			});
			await tweet.save();
			return tweet;
		}
	} catch (error) {
		res.status(NOT_ACCEPTABLE).json({ success: false, error: error });
	}
};

/**
 * Get all Tweets where sended is false
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<TweetDocument[] | undefined>}
 */
export const getAllTweetNotSended = async (
	_req: Request,
	res: Response
): Promise<TweetDocument[] | undefined> => {
	try {
		return await Tweet.find({ sended: false }).exec();
	} catch (error) {
		res.status(NOT_ACCEPTABLE).json({ success: false, error: error });
	}
};

/**
 * Send Tweet to Twitter
 * @param {TweetDocument} tweet
 * @param {Response} res
 * @returns
 */
export const sendTweet = async (tweet: TweetDocument, res: Response) => {
	const appKey = env.TWITTER_API_KEY as string;
	const appSecret = env.TWITTER_API_SECRET as string;
	const clientToken = env.TWITTER_ACCESS_TOKEN as string;
	const clientSecretToken = env.TWITTER_ACCESS_TOKEN_SECRET as string;
	const client = new TwitterApi({
		appKey: appKey,
		appSecret: appSecret,
		accessToken: clientToken,
		accessSecret: clientSecretToken,
	});

	try {
		await client.v1.tweet(tweet.link);
	} catch (error) {
		console.log(error.message);
	}
};

/**
 * Update Tweet by ID
 * @param {TweetDocument} tweet
 * @returns {Promise<TweetDocument | null>}
 */
export const update = async (
	tweet: TweetDocument
): Promise<TweetDocument | null> => {
	try {
		const updateTweet: TweetDocument | null = await Tweet.findByIdAndUpdate(
			{ _id: tweet.id },
			{
				$set: {
					sended: true,
				},
			}
		);
		return updateTweet;
	} catch (error) {
		console.log("Mise à jour du tweet en DB impossible");
		return null;
	}
};
