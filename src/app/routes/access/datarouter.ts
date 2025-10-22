import app from "../../..";

export default function () {
  app.post("/datarouter/api/v1/public/data", async (c) => {
    return c.json([]);
  });

  app.post("/datarouter/api/v1/public/data/clients", async (c) => {
    return c.json([]);
  });

  app.post("/telemetry/data/datarouter/api/v1/public/data", async (c) => {
    return c.json([]);
  });
}
