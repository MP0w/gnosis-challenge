import express, { Application, NextFunction, Request, Response } from "express";
import { AppDependencies } from "./dependencies";
import cors from "cors";
import session from "express-session";
import { authRouter } from "./unauthenticated/authRouter";
import { authenticatedRouter } from "./authenticated/authenticatedRouter";

export function setupRoutes(app: Application, dependencies: AppDependencies) {
  const PORT = process.env.PORT || 4000;

  app.use(express.json());

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME!,
      secret: process.env.SESSION_SECRET!,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
        domain:
          process.env.NODE_ENV === "production"
            ? process.env.COOKIE_DOMAIN
            : undefined,
      },
    })
  );

  app.use("/api", authRouter(dependencies));

  app.use("/api", authenticatedRouter(dependencies));

  // Add error handling middleware
  app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err.name === "UnauthorizedError" || err.message.includes("session")) {
      console.error(`Session error: ${err.message}`);
      res.status(401).json({ error: "Session invalid or expired" });
    } else {
      console.error(
        `error handled in ${req.statusCode} ${req.path}\n\n ${err.stack}\n-----`
      );
      res.status(500).send({ error: err.message });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
