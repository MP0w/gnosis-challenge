import request from "supertest";
import express from "express";
import { profileRouter } from "../profileRouter";
import { AppDependencies } from "../../dependencies";
import { SessionData } from "../../sessionAuth";
import { ProfileService } from "../../../services/profileService";

describe("Profile Router", () => {
  let app: express.Application;
  let mockProfileService: jest.Mocked<ProfileService>;
  const testUserId = "123";
  let skipAuth = false;

  beforeEach(() => {
    jest.resetAllMocks();
    skipAuth = false;

    mockProfileService = {
      getProfile: jest.fn(),
      createOrUpdateProfile: jest.fn(),
    } as any;

    const di: AppDependencies = {
      profileService: mockProfileService,
    } as any;

    app = express();
    app.use(express.json());

    app.use((req, _, next) => {
      req.session = {
        user: skipAuth
          ? undefined
          : {
              id: testUserId,
            },
      } as SessionData;
      next();
    });

    app.use("/api/profile", profileRouter(di));
  });

  describe("GET /api/profile", () => {
    it("should return 401 if user is not authenticated", async () => {
      skipAuth = true;
      await request(app).get("/api/profile").expect(401);
    });

    it("should return user profile", async () => {
      const mockProfile = {
        userId: testUserId,
        address: "0x123",
        username: "testuser",
        bio: "test bio",
      };
      mockProfileService.getProfile.mockResolvedValue(mockProfile);

      const response = await request(app).get("/api/profile").expect(200);

      expect(response.body).toEqual(mockProfile);
    });
  });

  describe("PUT /api/profile", () => {
    it("should return 401 if user is not authenticated", async () => {
      skipAuth = true;

      await request(app).put("/api/profile").expect(401);
    });

    it("should update profile with valid data", async () => {
      const profileData = {
        userId: testUserId,
        address: "0x123",
        username: "testuser",
        bio: "test bio",
      };
      mockProfileService.createOrUpdateProfile.mockImplementation(
        (userId, data) => {
          expect(userId).toBe(profileData.userId);
          return Promise.resolve({
            ...profileData,
            bio: data.bio ?? undefined,
            username: data.username ?? undefined,
          });
        }
      );

      const response = await request(app)
        .put("/api/profile")
        .send({
          username: "mpow",
          bio: "nice bio",
        })
        .expect(200);

      expect(response.body).toEqual({
        userId: testUserId,
        address: "0x123",
        username: "mpow",
        bio: "nice bio",
      });
    });

    it("should return 422 for invalid username", async () => {
      const response = await request(app)
        .put("/api/profile")
        .send({
          username: "ab", // Too short
          bio: "test bio",
        })
        .expect(422);

      expect(response.body).toMatchObject({
        message: "Invalid profile data",
      });
    });

    it("should return 422 for too long bio", async () => {
      const response = await request(app)
        .put("/api/profile")
        .send({
          username: "testuser",
          bio: "a".repeat(256), // Too long
        })
        .expect(422);

      expect(response.body).toMatchObject({
        message: "Invalid profile data",
      });
    });
  });
});
