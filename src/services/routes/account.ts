import app from "../..";
import User from "../../database/models/User";

export default function () {
  app.get("/account/api/public/account/:accountid", async (c) => {
    const user = await User.findOne({ accountId: c.req.param("accountid") });
    if (!user) return c.json([], 404);

    return c.json({
      id: user.accountId,
      displayName: user.username,
      email: user.email,
      failedLoginAttempts: 0,
      lastLogin: new Date().toISOString(),
      numberOfDisplayNameChanges: 0,
      ageGroup: "UNKNOWN",
      headless: false,
      country: "US",
      lastName: "Server",
      preferredLanguage: "en",
      canUpdateDisplayName: false,
      tfaEnabled: false,
      emailVerified: true,
      minorVerified: false,
      minorExpected: false,
      minorStatus: "NOT_MINOR",
      cabinedMode: false,
      hasHashedEmail: false,
    });
  });

  app.get("/account/api/public/account", async (c) => {
    const { accountId }: any = c.req.queries();

    let user = await User.findOne({
      accountId: accountId,
    });
    if (!user) return c.json([], 404);

    return c.json([
      {
        id: user?.accountId,
        displayName: user?.username,
        externalAuths: {},
      },
    ]);
  });

  app.get("/account/api/public/account/displayName/:username", async (c) => {
    const user = await User.findOne({ username: c.req.param("username") });
    if (!user) return c.json([], 404);

    return c.json({
      id: user.accountId,
      displayName: user.username,
      externalAuths: {},
    });
  });

  app.post(
    "/account/api/public/account/:accountId/externalAuths",
    async (c) => {
      return c.json([]);
    }
  );

  app.get("/api/v1/search", async (c) => {
    const { prefix, platform } = await c.req.query();
    if (!prefix) return c.json({});

    try {
      const users = await User.find({
        username: new RegExp(`^${prefix.toLowerCase()}`),
        banned: false,
      }).lean();

      const response = users.slice(0, 100).map((user, index) => ({
        accountId: user.accountId,
        matches: [
          {
            value: user.username,
            platform: platform,
          },
        ],

        matchType: prefix.toLowerCase() === user.username ? "exact" : "prefix",
        epicMutuals: 0,
        sortPosition: index,
      }));

      return c.json(response);
    } catch (error) {
      return console.error(error);
    }
  });

  app.get("/fortnite/api/game/v2/privacy/account/:accountId", async (c) => {
    return c.json({
      accountId: c.req.param("accountId"),
      optOutOfPublicLeaderboards: false,
    });
  });
}
