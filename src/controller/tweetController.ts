import * as tweetService from "@/service/tweet";
import { NextFunction, Request, Response } from "express";
import * as feedService from "@/service/feed";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import Logger from "@/utils/logger";

//POST /tweet/create
export const createTweetInDB = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<string> | void> => {
	try {
		// Get all Feeds
		const feeds = await feedService.findFeeds();
		// Pour chaque feeds
		feeds?.forEach(async (feed) => {
			try {
				const response = await axios.get(feed.link);

				// Parse le XML
				const parser = new XMLParser();
				let jObj = parser.parse(response.data);
				//Stockage des article dans un tableau
				let articles = jObj.rss.channel.item;
				let linkPublication: string = articles[0].link;
				let titlePublication: string = articles[0].title;
				let datePub: Date | string = new Date(articles[0].pubDate); //date du xml formatté en format date
				let nowMoinsUn = new Date(
					new Date().setHours(new Date().getHours() - 1)
				); // Aujourd'hui - 1 heure
				//Si la date de l'article est égale à aujourd'hui moins 1 heure
				if (datePub.getDay() === nowMoinsUn.getDay() && datePub > nowMoinsUn) {
					const dateToString = datePub.toString();
					//Remplissage de la DB
					req.body = {
						link: linkPublication,
						pubDate: dateToString,
						title: titlePublication,
						sended: false,
					};
					// Création du tweet en DB
					await tweetService.createTweet(req, res);
				}
			} catch (error) {
				return;
			}
		});
		return res.status(201).json({ message: "Tweets créés" });
	} catch (error) {
		Logger.error(error.message);
		return res.status(404).json({ message: "Rien à créer" });
	}
};

//POST /tweet
export const check = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<string> | void> => {
	try {
		//Récupére tous les tweets qui ont sended à false
		const tweets = await tweetService.getAllTweetNotSended(req, res);
		//pour chaque tweet
		if (tweets !== undefined) {
			Logger.info(tweets.length + " tweets à envoyer");
			tweets.forEach(async (tweet) => {
				//envoi du tweet
				await tweetService.sendTweet(tweet);
				// update du tweet à sended true
				await tweetService.update(tweet);
			});
		}
		Logger.info("Pas de nouveau tweet à envoyer");
		return res.status(404).json({ message: "Rien à envoyer" });
	} catch (error) {
		Logger.error(error.message);
	}
};
