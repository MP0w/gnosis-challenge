import { Router, Response } from "express";
import { generateNonce, SiweError } from "siwe";
import { RequestWithSession } from "../sessionAuth";
import getUuidByString from "uuid-by-string";
import { z } from "zod";
import { AppDependencies } from "../dependencies";

const signInSchema = z.object({
  message: z.string(),
  signature: z.string(),
});

export function authRouter(di: AppDependencies) {
  const router = Router();

  router.get("/nonce", (req: RequestWithSession, res: Response) => {
    req.session.nonce = generateNonce();

    res.send({ nonce: req.session.nonce });
  });

  router.post("/sign-in", async (req: RequestWithSession, res: Response) => {
    try {
      if (!req.session.nonce) {
        res.status(422).json({
          message: "Expected nonce in session.",
        });
        return;
      }

      const { success: valid, data } = signInSchema.safeParse(req.body);

      if (!valid || !data) {
        res.status(422).json({
          message: "Invalid sign in data",
        });
        return;
      }

      const { message, signature } = data;

      const verifiedMessage = await di.userService.verifyUser({
        nonce: req.session.nonce,
        message,
        signature,
      });

      req.session.user = {
        id: getUuidByString(verifiedMessage.address),
        siwe: verifiedMessage,
      };

      if (verifiedMessage.expirationTime) {
        req.session.cookie.expires = new Date(verifiedMessage.expirationTime);
      }

      const user = await di.userService.createOrUpdateUser({
        id: req.session.user.id,
        address: req.session.user.siwe.address,
      });

      req.session.save(() => res.status(200).send(user));
    } catch (e) {
      req.session.user = undefined;
      req.session.nonce = undefined;
      console.error("Error signing in", e);

      const type = e instanceof SiweError ? e.type : undefined;
      const message = e instanceof Error ? e.message : `${e} ${type}`;

      req.session.save(() => res.status(type ? 422 : 500).json({ message }));
    }
  });

  return router;
}
