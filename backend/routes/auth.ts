import { Application, Router, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

export function authRouter(_: Application) {
  const router = Router();

  router.get(
    "/hello",
    expressAsyncHandler(async (_: Request, res: Response) => {
      res.json("Hello World Computer");
    })
  );

  return router;
}
