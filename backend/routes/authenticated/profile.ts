import { Router, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

export function profileRouter(router: Router) {
  router.get(
    "/profile",
    expressAsyncHandler(async (_: Request, res: Response) => {
      res.json({ message: "profile" });
    })
  );

  return router;
}
