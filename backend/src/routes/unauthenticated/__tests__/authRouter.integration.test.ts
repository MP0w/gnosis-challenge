import request from "supertest";
import express from "express";
import { authRouter } from "../authRouter";
import { AppDependencies } from "../../dependencies";
import { UserService } from "../../../services/userService";
import { SiweError, SiweErrorType } from "siwe";
import session from "express-session";

describe("Auth Router", () => {
  let app: express.Application;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    jest.resetAllMocks();

    mockUserService = {
      verifyUser: jest.fn(),
      createOrUpdateUser: jest.fn(),
    } as any;

    const di: AppDependencies = {
      userService: mockUserService,
    } as any;

    app = express();
    app.use(express.json());

    app.use(
      session({
        secret: "test-secret",
        resave: false,
        saveUninitialized: true,
      })
    );

    app.use(authRouter(di));
  });

  describe("GET /nonce", () => {
    it("should return a nonce", async () => {
      const response = await request(app).get("/nonce").expect(200);

      expect(response.body.nonce).toBeDefined();
      expect(typeof response.body.nonce).toBe("string");
    });
  });

  describe("POST /sign-in", () => {
    it("should return 422 if nonce is missing from session", async () => {
      const response = await request(app)
        .post("/sign-in")
        .send({
          message: "test message",
          signature: "test signature",
        })
        .expect(422);

      expect(response.body).toMatchObject({
        message: "Expected nonce in session.",
      });
    });

    it("should return 422 if request body is invalid", async () => {
      const agent = request.agent(app);
      await agent.get("/nonce"); // Set nonce in session

      const response = await agent
        .post("/sign-in")
        .send({
          message: "test message",
          // Missing signature field
        })
        .expect(422);

      expect(response.body).toMatchObject({
        message: "Invalid sign in data",
      });
    });

    it("should successfully sign in user", async () => {
      const mockVerifiedMessage = {
        address: "0x123",
      };
      const mockUser = {
        id: "test-uuid",
        address: mockVerifiedMessage.address,
      };

      mockUserService.verifyUser.mockResolvedValue(mockVerifiedMessage as any);
      mockUserService.createOrUpdateUser.mockResolvedValue(mockUser as any);

      const agent = request.agent(app);
      await agent.get("/nonce"); // Set nonce in session

      const response = await agent
        .post("/sign-in")
        .send({
          message: "test message",
          signature: "test signature",
        })
        .expect(200);

      expect(response.body).toEqual(mockUser);
    });

    it("should handle expired message error", async () => {
      mockUserService.verifyUser.mockRejectedValue(
        new SiweError(SiweErrorType.EXPIRED_MESSAGE)
      );

      const agent = request.agent(app);
      await agent.get("/nonce"); // Set nonce in session

      const response = await agent
        .post("/sign-in")
        .send({
          message: "test message",
          signature: "test signature",
        })
        .expect(440);

      expect(response.body).toBeDefined();
    });

    it("should handle invalid signature error", async () => {
      mockUserService.verifyUser.mockRejectedValue(
        new SiweError(SiweErrorType.INVALID_SIGNATURE)
      );

      const agent = request.agent(app);
      await agent.get("/nonce"); // Set nonce in session

      const response = await agent
        .post("/sign-in")
        .send({
          message: "test message",
          signature: "test signature",
        })
        .expect(422);

      expect(response.body).toBeDefined();
    });
  });
});
