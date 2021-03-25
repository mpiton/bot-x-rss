require("dotenv").config();
const path = require("path");
const axios = require("axios");
let Parser = require("rss-parser");
let parser = new Parser();
const { TwitterClient } = require("twitter-api-client");

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

axios
	.get("http://bot-twitter.4o4.fr/db.json")
	.then((response) => {
		// Success 🎉
		let feeds = response.data.feeds;
		//console.log(feeds);
		//Pour chaque feeds as feed
		feeds.forEach((lien) => {
			//récupération des données du feed
			axios
				.get(lien.link)
				.then((response) => {
					// Success 🎉
					async () => {
						//On parse la data de mon feed
						await parser.parseURL(lien.link, (error, feed) => {
							if (error) {
							}
							if (feed && feed.items && feed.items.length > 0) {
								let links = feed.items;
								links.forEach((link) => {
									if (diff_hours(new Date(), new Date(link.pubDate)) <= 1) {
										//template du tweet
										let tweet = link.title + ": " + link.link;
										//console.log(tweet);
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
							}
						});
					};
				})
				.catch((error) => {
					// Error 😨
					if (error.response) {
						/*
						 * The request was made and the server responded with a
						 * status code that falls out of the range of 2xx
						 */
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					} else if (error.request) {
						/*
						 * The request was made but no response was received, `error.request`
						 * is an instance of XMLHttpRequest in the browser and an instance
						 * of http.ClientRequest in Node.js
						 */
						console.log(error.request);
					} else {
						// Something happened in setting up the request and triggered an Error
						console.log("Error", error.message);
					}
					console.log(error.config);
				});
		});
	})
	.catch((error) => {
		// Error 😨
		if (error.response) {
			/*
			 * The request was made and the server responded with a
			 * status code that falls out of the range of 2xx
			 */
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
		} else if (error.request) {
			/*
			 * The request was made but no response was received, `error.request`
			 * is an instance of XMLHttpRequest in the browser and an instance
			 * of http.ClientRequest in Node.js
			 */
			console.log(error.request);
		} else {
			// Something happened in setting up the request and triggered an Error
			console.log("Error", error.message);
		}
		console.log(error.config);
	});
