import app from "../..";
import discovery from "../../resources/discovery/discovery.json";

export default function () {
  app.get("/fortnite/api/discovery/accessToken/:branch", async (c) => {
    return c.json({
      branchName: c.req.param("branch"),
      appId: "Fortnite",
      token: "Core",
    });
  });

  app.post("/api/v2/discovery/surface/*", async (c) => {
    return c.json(discovery);
  });

  app.post("/api/v1/links/lock-status/:accountId/check", async (c) => {
    return c.json({
      results: [],
      hasMore: false,
    });
  });
}
