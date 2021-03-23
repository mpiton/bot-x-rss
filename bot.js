require("dotenv").config();
const path = require("path");
const axios = require("axios");
let Parser = require("rss-parser");
let parser = new Parser();
// server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const { TwitterClient } = require("twitter-api-client");

server.use(middlewares);
server.use(router);

const twitterClient = new TwitterClient({
	apiKey: process.env.TWITTER_API_KEY,
	apiSecret: process.env.TWITTER_API_SECRET,
	accessToken: process.env.TWITTER_ACCESS_TOKEN,
	accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const diff_hours = (dt2, dt1) => {
	let diff = (dt2.getTime() - dt1.getTime()) / 1000;
	diff /= 60 * 60;
	return Math.abs(Math.round(diff));
};
Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + h * 60 * 60 * 1000);
	return this;
};

// Récupération de la liste de mes feeds
axios
	.get("http://localhost:3000/feeds")
	.then((response) => {
		let feeds = response.data;
		//Pour chaque feeds as feed
		feeds.forEach((feed) => {
			//récupération des données du feed
			axios.get(feed.link).then(
				(async () => {
					//On parse la data de mon feed
					let myfeed = await parser.parseURL(feed.link);
					//console.log(myfeed.title); -> titre de mon feed

					//pour chaque articles dans mon feed
					myfeed.items.forEach((item) => {
						//Si la date de publication est inférieur ou égale à 1 heure
						if (diff_hours(new Date(), new Date(item.pubDate)) <= 1) {
							//template du tweet
							let tweet = item.title + " - " + item.link;
							//envoi du tweet
							twitterClient.tweets
								.statusesUpdate({
									status: tweet,
								})
								.then((response) => {
									console.log("Tweeted!", response);
								})
								.catch((err) => {
									console.error(err);
								});
						}
					});
				})()
			);
		});
	})
	.catch((err) => {
		console.error(err);
	});

server.listen(process.env.PORT, () => {
	console.log("JSON Server is running");
});
