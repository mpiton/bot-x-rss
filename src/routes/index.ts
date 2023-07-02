import * as feedController from "@/controller/feedController";
import * as homeController from "@/controller/home";
import * as tweetController from "@/controller/tweetController";

import { Router } from "express";

const router = Router();

router.get("/", homeController.getAppInfo);

//Feeds
router.get("/feeds", feedController.getAll); //récupère tous les rss
router.post("/feed", feedController.create); // crée un rss

//Tweets
router.post("/tweet/create", tweetController.createTweetInDB); //vérifie les rss et insert les futurs tweet en DB
router.post("/tweet", tweetController.check); //envoi les tweet

export default router;
