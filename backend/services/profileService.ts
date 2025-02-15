import { ProfileRepository } from "../repositories/profileRepository";
import { Profile, Users } from "../dbTypes";
import { ProfileDto, UpdateProfileDto } from "../entities/profileDtos";
import { UserRepository } from "../repositories/userRepository";

export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getProfile(userId: string): Promise<ProfileDto | undefined> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      return undefined;
    }

    const profile = await this.profileRepository.getByUserId(userId);

    return this.makeProfileDto(user, profile);
  }

  async createOrUpdateProfile(
    userId: string,
    data: UpdateProfileDto
  ): Promise<ProfileDto | undefined> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      return undefined;
    }

    const profile = await this.profileRepository.createOrUpdateByUserId(
      userId,
      data
    );

    return this.makeProfileDto(user, profile);
  }

  private makeProfileDto(
    user: Users,
    profile: Profile | undefined
  ): ProfileDto {
    return {
      userId: user.id,
      address: user.address,
      username: profile?.username || undefined,
      bio: profile?.bio || undefined,
    };
  }
}
