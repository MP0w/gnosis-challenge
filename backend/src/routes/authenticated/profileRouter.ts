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

export function profileRouter(router: Router, di: AppDependencies) {
  router.get(
    "/profile",
    authenticatedAsyncHandler(
      async (req: AuthenticatedRequest, res: Response) => {
        const profile = await di.profileService.getProfile(req.session.user.id);
        res.json(profile);
      }
    )
  );

  router.put(
    "/profile",
    authenticatedAsyncHandler(
      async (req: AuthenticatedRequest, res: Response) => {
        const profileData = profileSchema.parse({
          username: req.body.username,
          bio: req.body.bio,
        });

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
