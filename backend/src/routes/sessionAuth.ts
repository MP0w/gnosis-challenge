import { Session } from "express-session";
import { Request, Response } from "express";
import { SiweMessage } from "siwe";
import expressAsyncHandler from "express-async-handler";

interface UserData {
  id: string;
  siwe: SiweMessage;
}

export interface SessionData extends Session {
  nonce?: string;
  user?: UserData;
}

export interface AuthenticatedSessionData extends Session {
  user: UserData;
}

export type RequestWithSession = Request & {
  session: SessionData;
};

export type AuthenticatedRequest = Request & {
  session: AuthenticatedSessionData;
};

export function authenticatedAsyncHandler(
  handler: (req: AuthenticatedRequest, res: Response) => Promise<void>
) {
  return expressAsyncHandler(async (req: RequestWithSession, res: Response) => {
    if (!req.session.user) {
      res.status(401).json({ message: "user not authenticated" });
      return;
    }
    return handler(req as AuthenticatedRequest, res);
  });
}