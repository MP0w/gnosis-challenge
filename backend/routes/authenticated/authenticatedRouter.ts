import { Application, NextFunction, Router, Response } from "express";
import { profileRouter } from "./profileRouter";
import { RequestWithSession } from "../sessionAuth";

export function authenticatedRouter(_: Application) {
  const router = Router();

  router.use((req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      res.status(401).json({ message: "user not authenticated" });
      return;
    }
    next();
  });

  profileRouter(router);

  return router;
}
