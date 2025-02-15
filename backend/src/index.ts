import { configDotenv } from "dotenv";
import express from "express";
import { setupRoutes } from "./routes/setupRoutes";
import { createDependencies } from "./routes/dependencies";

configDotenv({ path: ".env" });
configDotenv({ path: ".env.production", override: true });

const app = express();
const dependencies = createDependencies();

setupRoutes(app, dependencies);
