import { Router, Response } from "express";
import {
  authenticatedAsyncHandler,
  AuthenticatedRequest,
} from "../sessionAuth";
import { z } from "zod";
import { AppDependencies } from "../dependencies";

const profileSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(255).nullable(),
});

export function profileRouter(di: AppDependencies) {
  const router = Router();

  router.get(
    "/",
    authenticatedAsyncHandler(
      async (req: AuthenticatedRequest, res: Response) => {
        const profile = await di.profileService.getProfile(req.session.user.id);
        res.json(profile);
      }
    )
  );

  router.put(
    "/",
    authenticatedAsyncHandler(
      async (req: AuthenticatedRequest, res: Response) => {
        const { success: valid, data: profileData } = profileSchema.safeParse({
          username: req.body.username,
          bio: req.body.bio,
        });

        if (!profileData || !valid) {
          res.status(422).json({
            message: "Invalid profile data",
          });
          return;
        }

        const profile = await di.profileService.createOrUpdateProfile(
          req.session.user.id,
          profileData
        );
        res.json(profile);
      }
    )
  );

  return router;
}
