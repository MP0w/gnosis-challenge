import { Router, Response } from "express";
import { ProfileRepository } from "../../repositories/profileRepository";
import { dbConnection } from "../../dbConnection";
import {
  authenticatedAsyncHandler,
  AuthenticatedRequest,
} from "../sessionAuth";
import { ProfileService } from "../../services/profileService";
import { UserRepository } from "../../repositories/userRepository";
import { z } from "zod";

const profileSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(255).nullable(),
});

export function profileRouter(router: Router) {
  const profileRepository = new ProfileRepository(dbConnection);
  const userRepository = new UserRepository(dbConnection);
  const profileService = new ProfileService(profileRepository, userRepository);

  router.get(
    "/profile",
    authenticatedAsyncHandler(
      async (req: AuthenticatedRequest, res: Response) => {
        const profile = await profileService.getProfile(req.session.user.id);
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

        const profile = await profileService.createOrUpdateProfile(
          req.session.user.id,
          profileData
        );
        res.json(profile);
      }
    )
  );

  return router;
}
