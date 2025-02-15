import { UserService } from "../userService";
import { UserRepository } from "../../repositories/userRepository";
import { Users } from "../../dbTypes";

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  const mockUser: Users = {
    id: "123",
    address: "0x452aA85C3aaDC7c0A7E6bda88e08374C0c56CE8f",
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    mockUserRepository = {
      getById: jest.fn(),
      createOrUpdate: jest.fn(),
    } as any;

    userService = new UserService(mockUserRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("verifyUser", () => {
    const args = {
      message:
        "http://localhost:3000 wants you to sign in with your Ethereum account:\n0x452aA85C3aaDC7c0A7E6bda88e08374C0c56CE8f\n\nSign in\n\nURI: http://localhost:3000\nVersion: 1\nChain ID: 1\nNonce: PiEM85UpOAQOl8e3q\nIssued At: 2025-02-15T12:37:13.581Z",
      signature:
        "0x480f4508531d445b745147bd067fdf19edf7183cac6f3cc7d0d47e246535733930a728397c532ef46a3b4dc239a670660821109e31faafb611fc5372be1bbd7d1b",
      nonce: "PiEM85UpOAQOl8e3q",
    };

    const mockVerifiedMessage = {
      address: mockUser.address,
      nonce: "PiEM85UpOAQOl8e3q",
    };

    it("should verify SIWE message and return verified message", async () => {
      const result = await userService.verifyUser(args);

      expect(result.address).toEqual(mockVerifiedMessage.address);
      expect(result.nonce).toEqual(mockVerifiedMessage.nonce);
    });
  });

  describe("getUser", () => {
    it("should return user when found", async () => {
      mockUserRepository.getById.mockResolvedValue(mockUser);

      const result = await userService.getUser(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(mockUser.id);
    });

    it("should return undefined when user not found", async () => {
      mockUserRepository.getById.mockResolvedValue(undefined);

      const result = await userService.getUser("non-existent-id");

      expect(result).toBeUndefined();
    });
  });

  describe("createOrUpdateUser", () => {
    const createUserArgs = {
      id: "user-123",
      address: "0x123",
    };

    it("should create or update user and return result", async () => {
      mockUserRepository.createOrUpdate.mockResolvedValue(mockUser);

      const result = await userService.createOrUpdateUser(createUserArgs);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.createOrUpdate).toHaveBeenCalledWith(
        createUserArgs
      );
    });
  });
});
