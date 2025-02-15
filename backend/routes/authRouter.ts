import { Application, Router, Response } from "express";
import { generateNonce, SiweError, SiweErrorType } from "siwe";
import { RequestWithSession } from "./sessionAuth";
import getUuidByString from "uuid-by-string";
import { dbConnection } from "../dbConnection";
import { UserService } from "../services/userService";
import { UserRepository } from "../repositories/userRepository";
import { z } from "zod";

const signInSchema = z.object({
  message: z.string(),
  signature: z.string(),
});

export function authRouter(_: Application) {
  const router = Router();
  const userService = new UserService(new UserRepository(dbConnection));

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

      const { message, signature } = signInSchema.parse(req.body);

      const verifiedMessage = await userService.verifyUser({
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

      const user = await userService.createOrUpdateUser({
        id: req.session.user.id,
        address: req.session.user.siwe.address,
      });

      req.session.save(() => res.status(200).send(user));
    } catch (e) {
      req.session.user = undefined;
      req.session.nonce = undefined;
      console.error("Error signing in", e);

      const type = e instanceof SiweError ? e.type : undefined;
      const message = e instanceof Error ? e.message : `${e}`;

      const statusCode = () => {
        switch (type) {
          case SiweErrorType.EXPIRED_MESSAGE: {
            return 440;
          }
          case SiweErrorType.INVALID_SIGNATURE: {
            return 422;
          }
          default: {
            return 500;
          }
        }
      };

      req.session.save(() => res.status(statusCode()).json({ message }));
    }
  });

  return router;
}
