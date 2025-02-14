import { Session } from "express-session";
import { Request } from "express";
import { SiweMessage } from "siwe";
export interface SessionData extends Session {
  nonce?: string;
  siwe?: SiweMessage;
}

export type RequestWithSession = Request & {
  session: SessionData;
};
