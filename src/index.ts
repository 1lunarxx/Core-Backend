import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HandleNotFound } from "./utils/handling/errorHandler";
import { Log } from "./utils/handling/logging";
import { createCatalog } from "./utils/creationTools/createShop";
import { writeFile } from "fs/promises";
import { DataBase } from "./database/wrapper";
import { Config } from "./utils/config";
import LoadRoutes from "./utils/routing/loadRoutes";
import path from "path";

const app = new Hono({ strict: false });

export const config = new Config();
await config.register();

app.use("*", cors());
if (config.get("log")) app.use(logger());

app.notFound(async (c) => {
  return HandleNotFound(c);
});

export default app;

export const db = new DataBase({
  connectionString: config.get("connectionString"),
});

await db.connect();
await LoadRoutes.loadRoutes(path.join(__dirname, "services"), app);

const catalog = createCatalog();
await writeFile(
  "src/resources/storefront/catalog.json",
  JSON.stringify(catalog, null, 2)
);

// await import("./bot/index");
Log(`Running on port ` + config.get("port"));
