import { configDotenv } from "dotenv";

configDotenv({ path: ".env.local" });

import express, { NextFunction, Request, Response } from "express";
import { authRouter } from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Add error handling middleware
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  console.error(
    `error handled in ${req.method} ${req.path}\n\n ${err.stack}\n-----`
  );
  res.status(500).send({ error: err.message });
});

app.use("/", authRouter(app));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
