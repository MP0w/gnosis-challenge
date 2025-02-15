import { dbConnection } from "../dbConnection";
import { ProfileRepository } from "../repositories/profileRepository";
import { UserRepository } from "../repositories/userRepository";
import { ProfileService } from "../services/profileService";
import { UserService } from "../services/userService";

export interface AppDependencies {
  profileService: ProfileService;
  userService: UserService;
}

export function createDependencies(): AppDependencies {
  const profileRepository = new ProfileRepository(dbConnection);
  const userRepository = new UserRepository(dbConnection);
  const profileService = new ProfileService(profileRepository, userRepository);
  const userService = new UserService(userRepository);

  return {
    profileService,
    userService,
  };
}

export const dependencies = createDependencies();
