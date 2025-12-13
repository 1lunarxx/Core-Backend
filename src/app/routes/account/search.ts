import app from "../../..";
import User from "../../../db/models/user";

export default function () {
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
}
