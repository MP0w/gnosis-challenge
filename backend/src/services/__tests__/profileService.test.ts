import { ProfileService } from "../profileService";
import { ProfileRepository } from "../../repositories/profileRepository";
import { UserRepository } from "../../repositories/userRepository";
import { Profile, Users } from "../../dbTypes";

describe("ProfileService", () => {
  let profileService: ProfileService;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  const mockUser: Users = {
    id: "123",
    address: "0x123",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProfile: Profile = {
    user_id: "123",
    username: "testuser",
    bio: "test bio",
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    mockProfileRepository = {
      getByUserId: jest.fn(),
      createOrUpdateByUserId: jest.fn(),
    } as any;

    mockUserRepository = {
      getById: jest.fn(),
    } as any;

    profileService = new ProfileService(
      mockProfileRepository,
      mockUserRepository
    );
  });

  describe("getProfile", () => {
    it("should return undefined when user does not exist", async () => {
      mockUserRepository.getById.mockResolvedValue(undefined);

      const result = await profileService.getProfile("non-existent-id");

      expect(result).toBeUndefined();
    });

    it("should return a partial profile when user exists but has no profile", async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);
      mockProfileRepository.getByUserId.mockResolvedValue(undefined);

      const result = await profileService.getProfile(mockUser.id);

      expect(result).toEqual({
        userId: mockUser.id,
        address: mockUser.address,
        username: undefined,
        bio: undefined,
      });
    });

    it("should return complete profile when user and profile exist", async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);
      mockProfileRepository.getByUserId.mockResolvedValue(mockProfile);

      const result = await profileService.getProfile(mockUser.id);

      expect(result).toEqual({
        userId: mockUser.id,
        address: mockUser.address,
        username: mockProfile.username,
        bio: mockProfile.bio,
      });
    });
  });

  describe("createOrUpdateProfile", () => {
    const updateData = {
      username: "newusername",
      bio: "new bio",
    };

    it("should return undefined when user does not exist", async () => {
      mockUserRepository.getById.mockResolvedValue(undefined);

      const result = await profileService.createOrUpdateProfile(
        "non-existent-id",
        updateData
      );

      expect(result).toBeUndefined();
    });

    it("should create/update and return profile when user exists", async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);
      mockProfileRepository.createOrUpdateByUserId.mockResolvedValue({
        ...mockProfile,
        ...updateData,
      });

      const result = await profileService.createOrUpdateProfile(
        mockUser.id,
        updateData
      );

      expect(result).toEqual({
        userId: mockUser.id,
        address: mockUser.address,
        username: updateData.username,
        bio: updateData.bio,
      });
    });
  });
});
