import { Application, Router, Response } from "express";
import { generateNonce, SiweError, SiweErrorType, SiweMessage } from "siwe";
import { RequestWithSession } from "./sessionAuth";

export function authRouter(_: Application) {
  const router = Router();

  router.get("/nonce", (req: RequestWithSession, res: Response) => {
    req.session.nonce = generateNonce();
    res.status(200).send({ nonce: req.session.nonce });
  });

  router.post(
    "/sign-in",
    async function (req: RequestWithSession, res: Response) {
      try {
        if (!req.body.message || !req.body.signature) {
          res
            .status(422)
            .json({ message: "Expected message and signature as body." });
          return;
        }

        const siweMessage = new SiweMessage(req.body.message);
        const { data: message } = await siweMessage.verify({
          signature: req.body.signature,
          nonce: req.session.nonce,
        });

        req.session.siwe = message;
        if (message.expirationTime) {
          req.session.cookie.expires = new Date(message.expirationTime);
        }
        req.session.save(() => res.status(200).send(true));
      } catch (e) {
        req.session.siwe = undefined;
        req.session.nonce = undefined;
        console.error(e);

        const type = e instanceof SiweError ? e.type : undefined;
        const message = e instanceof Error ? e.message : "error";

        switch (type) {
          case SiweErrorType.EXPIRED_MESSAGE: {
            req.session.save(() => res.status(440).json({ message }));
            break;
          }
          case SiweErrorType.INVALID_SIGNATURE: {
            req.session.save(() => res.status(422).json({ message }));
            break;
          }
          default: {
            req.session.save(() => res.status(500).json({ message }));
            break;
          }
        }
      }
    }
  );

  return router;
}
