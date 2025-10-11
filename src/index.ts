import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HandleNotFound } from "./utils/handling/errorHandler";
import { Log } from "./utils/handling/logging";
import { Connect } from "./db/connect";
import LoadRoutes from "./utils/routing/loadRoutes";
import path from "path";
import { createCatalog } from "./utils/creationTools/createShop";
import { writeFile } from "fs/promises";

const app = new Hono({ strict: false });

app.use(cors());

app.notFound(async (c) => {
  return HandleNotFound(c);
});

export default app;

Log(`Running on port ` + process.env.PORT);
Connect(process.env.MONGO || "mongodb://localhost:27017/core");

await LoadRoutes.loadRoutes(path.join(__dirname, "app"), app);

const catalog = createCatalog();
await writeFile(
  "src/resources/storefront/catalog.json",
  JSON.stringify(catalog, null, 2)
);

await import("./bot/index");
// await import("./matchmaker/index"); no longer used, you may use fortmatchmaker from lawin:
