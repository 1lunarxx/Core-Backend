import app from "../..";
import User from "../../database/models/User";

export default function () {
  app.get("/fortnite/api/v2/versioncheck/:platform", async (c) => {
    return c.json({
      type: "NO_UPDATE",
    });
  });

  app.get("/waitingroom/api/waitingroom", async (c) => {
    c.status(204);
    return c.json([]);
  });

  app.post("/publickey/v2/publickey", async (c) => {
    return c.json([]);
  });

  app.post(
    "/fortnite/api/game/v2/chat/:accountId/recommendGeneralChatRooms/:gameType/pc",
    async (c) => {
      return c.json({
        globalChatRooms: [
          {
            roomName: "fortnite",
            currentMembersCount: 0,
            maxMembersCount: 9999,
            publicFacingShardName: "",
          },
        ],
        founderChatRooms: [
          {
            roomName: "founder",
            currentMembersCount: 0,
            maxMembersCount: 9999,
            publicFacingShardName: "",
          },
        ],
        bNeedsPaidAccessForGlobalChat: false,
        bNeedsPaidAccessForFounderChat: false,
        bIsGlobalChatDisabled: false,
        bIsFounderChatDisabled: false,
        bIsSubGameGlobalChatDisabled: false,
      });
    }
  );

  app.get("/epic/friends/v1/:accountId/blocklist", async (c) => {
    return c.json([]);
  });

  app.get("/epic/id/v2/sdk/accounts", async (c) => {
    let user = await User.findOne({
      accountId: c.req.query("accountId"),
    });

    if (!user) return c.json([], 404);

    return c.json([
      {
        accountId: user?.accountId,
        displayName: user?.username,
        preferredLanguage: "en",
        cabinedMode: false,
        empty: false,
      },
    ]);
  });

  app.get("/launcher/api/public/distributionpoints", (c) =>
    c.json({
      distributions: [
        "https://epicgames-download1.akamaized.net/",
        "https://download.epicgames.com/",
        "https://download2.epicgames.com/",
        "https://download3.epicgames.com/",
        "https://download4.epicgames.com/",
        "https://fastly-download.epicgames.com/",
      ],
    })
  );

  app.get(
    "/fortnite/api/receipts/v1/account/:accountid/receipts",
    async (c) => {
      return c.json({});
    }
  );

  app.get("/fortnite/api/entitlementCheck", async (c) => {
    return c.json([], 200);
  });

  app.get("/waitingroom/api/waitingroom", async (c) => {
    return c.json([]);
  });

  app.post("/datarouter/api/v1/public/data", async (c) => {
    return c.json([], 200);
  });

  app.post("/datarouter/api/v1/public/data/clients", async (c) => {
    return c.json([], 200);
  });

  app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", async (c) => {
    c.header("Content-Type", "text/plain");
    return c.text("true");
  });

  app.get("/fortnite/api/game/v2/enabled_features", async (c) => {
    return c.json([]);
  });

  app.post("/fortnite/api/game/v2/grant_access/*", async (c) => {
    c.json({});
    return c.json([], 200);
  });

  app.get(
    "/fortnite/api/receipts/v1/account/:accountId/receipts",
    async (c) => {
      return c.json([]);
    }
  );
}
