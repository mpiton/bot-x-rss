import { Response, Request } from "express";
import Tweet from "@/models/Tweet";
import { TweetDocument } from "@/types/tweet/ITweet";
import { env } from "process";
import { TwitterApi } from "twitter-api-v2";
import mongoose from "mongoose";

/**
 * Creation of the tweet
 * @param {TweetDocument} data
 * @param {Response} res
 * @returns {Promise<TweetDocument | undefined>}
 */
export const createTweet = async (
	req: Request,
	res: Response
): Promise<TweetDocument | undefined> => {
	try {
		//Recherche si le tweet existe
		const searchTweet = await Tweet.find({ link: req.body.link });

		//S'il n'existe pas alors je crée
		if (searchTweet.find((elem) => elem.link === req.body.link) === undefined) {
			//Register Tweet
			const tweet = new Tweet({
				_id: new mongoose.Types.ObjectId(),
				link: req.body.link,
				pubDate: req.body.pubDate,
				title: req.body.title,
				sended: req.body.sended,
			});

			await tweet.save();
		}
	} catch (error) {
		return;
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
		return await Tweet.find({ sended: false });
	} catch (error) {
		return undefined;
	}
};

/**
 * Send Tweet to Twitter
 * @param {TweetDocument} tweet
 * @param {Response} res
 * @returns
 */
export const sendTweet = async (tweet: TweetDocument) => {
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
		await client.v1.tweet(tweet.title + " : " + tweet.link);
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
