import * as tweetService from "@/service/tweet";
import { NextFunction, Request, Response } from "express";
import { UNAUTHORIZED } from "http-status";
import * as feedService from "@/service/feed";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import Logger from "@/utils/logger";

//POST /tweet/create
export const createTweetInDB = async (
	_req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | undefined> => {
	try {
		// Get all Feeds
		const feeds = await feedService.findFeeds();
		// Pour chaque feeds
		feeds.forEach((feed) => {
			axios
				.get(feed.link)
				.then(async (response) => {
					// Parse le XML
					const parser = new XMLParser();
					let jObj = parser.parse(response.data);
					//Stockage des article dans un tableau
					let articles = jObj.rss.channel.item;
					let datePublication: string = articles[0].pubDate; //date récupéré dans le xml
					let linkPublication: string = articles[0].link;
					let datePub = new Date(datePublication); //date du xml formatté en format date
					let nowMoinsUn = new Date(
						new Date().setHours(new Date().getHours() - 1)
					); // Aujourd'hui - 1 heure
					//Si la date de l'article est égale à aujourd'hui moins 1 heure
					if (
						datePub.getDay() === nowMoinsUn.getDay() &&
						datePub > nowMoinsUn
					) {
						//Remplissage de la DB
						let data = {
							link: linkPublication,
							pubDate: datePublication,
							sended: false,
						};
						// Création du tweet en DB
						await tweetService.createTweet(data, res);
					}
					next();
				})
				.catch((error) => {
					Logger.error(error.message);
				});
		});
	} catch (error) {
		Logger.error(error.message);
		return res
			.status(UNAUTHORIZED)
			.json({ success: false, error: error.message });
	}
};

//POST /tweet
export const check = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | undefined> => {
	try {
		//Récupére tous les tweets qui ont sended à false
		const tweets = await tweetService.getAllTweetNotSended(req, res);
		//pour chaque tweet
		if (tweets !== undefined) {
			tweets.forEach((tweet) => {
				//envoi du tweet
				tweetService.sendTweet(tweet, res);
				// update du tweet à sended true
				tweetService.update(tweet);
			});
		}
		next();
	} catch (error) {
		return res.status(201).json({ success: false, error: error.message });
	}
};
