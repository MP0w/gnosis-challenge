import { NextFunction, Router, Response } from "express";
import { profileRouter } from "./profileRouter";
import { RequestWithSession } from "../../routes/sessionAuth";
import { AppDependencies } from "../dependencies";

export function authenticatedRouter(dependencies: AppDependencies) {
  const router = Router();

  router.use((req: RequestWithSession, res: Response, next: NextFunction) => {
    if (!req.session.user) {
      res.status(401).json({ message: "user not authenticated" });
      return;
    }
    next();
  });

  router.use("/profile", profileRouter(dependencies));

  return router;
}
