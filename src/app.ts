import * as errorHandler from "@/middlewares/errorHandler";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import routes from "@/routes";
import morganMiddleware from "./middlewares/morganMiddleware";

export const createApp = (): express.Application => {
	const app = express();

	app.use(cors());
	app.use(helmet());
	app.use(morganMiddleware);
	app.use(express.json());
	app.use(
		express.urlencoded({
			extended: true,
		})
	);

	// API Routes
	app.use("/", routes);

	// Error Middleware
	app.use(errorHandler.genericErrorHandler);
	app.use(errorHandler.notFoundError);

	return app;
};
