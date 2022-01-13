import * as homeService from "@/service/home";
import { Request, Response } from "express";

/**
 * Gets the API information.
 *
 * @param {Request} _req
 * @param {Response} res
 */
export const getAppInfo = (_req: Request, res: Response): void => {
	const result = homeService.getAppInfo();
	res.json(result);
};
