import * as feedService from "@/service/feed";
import * as tweetService from "@/service/tweet";
import Logger from "@/utils/logger";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { XMLParser } from "fast-xml-parser";

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
				const jObj = parser.parse(response.data);
				//Stockage des article dans un tableau
				const articles = jObj.rss.channel.item;
				const linkPublication: string = articles[0].link;
				const titlePublication: string = articles[0].title;
				const datePub: Date | string = new Date(articles[0].pubDate); //date du xml formatté en format date
				const nowMoinsUn = new Date(
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
				Logger.error(JSON.stringify(error));
			}
		});
	} catch (error) {
		Logger.error(JSON.stringify(error));
	}
	return res.status(201).json({ message: "Tweets créés" });
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
			Logger.info(`${tweets.length} tweets à envoyer`);
			tweets.forEach(async (tweet) => {
				//envoi du tweet
				await tweetService.sendTweet(tweet);
				// update du tweet à sended true
				await tweetService.update(tweet);
			});
		}
		Logger.info("Pas de nouveau tweet à envoyer");
		return res.status(200).json({ message: "Rien à envoyer" });
	} catch (error) {
		Logger.error(JSON.stringify(error));
		return res.status(404).json({ message: "Erreur" });
	}
};
