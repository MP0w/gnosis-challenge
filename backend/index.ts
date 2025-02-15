import { configDotenv } from "dotenv";
import cors from "cors";

configDotenv({ path: ".env" });
configDotenv({ path: ".env.production", override: true });

import express, { NextFunction, Request, Response } from "express";
import { authRouter } from "./routes/authRouter";
import session from "express-session";
import { authenticatedRouter } from "./routes/authenticated/authenticatedRouter";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    name: process.env.SESSION_COOKIE_NAME!,
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

app.use(authRouter(app));

app.use(authenticatedRouter(app));

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
