import app from "../../..";
import User from "../../../db/models/user";

export default function () {
  app.get("/statsproxy/api/statsv2/leaderboards/:type", async (c) => {
    let users = await User.find({});

    const entries = users.map((u) => ({
      account: u.accountId,
      value: 1,
    }));

    return c.json({
      entries,
      maxSize: 1000,
    });
  });

  app.get("/statsproxy/api/statsv2/account/:accountId", async (c) => {
    return c.json({
      startTime: 0,
      endTime: 0,
      stats: {},
      accountId: c.req.param("accountId"),
    });
  });
}
