import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Express middleware that generates or propagates a unique request ID.
 *
 * Sets the request ID on a custom property `req.requestId`,
 * and adds it to the response header as "x-request-id".
 */
export const requestIdGenerator = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = uuidv4();
    req.requestId = requestId;
    res.setHeader("x-request-id", requestId);
    next();
};
