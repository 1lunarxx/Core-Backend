import app from "../..";
import Tournaments from "../../database/models/Tournaments";
import User from "../../database/models/User";
import { getVersion } from "../../utils/handling/getVersion";
import { v4 } from "uuid";

export default function () {
  app.get("/api/v1/events/Fortnite/download/:accountId", async (c) => {
    const ver = await getVersion(c);
    if (!ver) return c.json({ error: "Incorrect HTTP Method" });
    if (ver.build < 8) {
      return c.json({});
    }
    const user = await User.findOne({ accountId: c.req.param("accountId") });
    if (!user) return c.json([], 404);

    const tournament = await Tournaments.findOne({ accountId: user.accountId });
    if (!tournament) return c.json([], 404);

    const hypeName = "NormalHype";
    const event: any = await Bun.file("src/resources/events/event.json").json();

    event.player.accountId = tournament.accountId;
    event.player.persistentScores = { [hypeName]: tournament.hype };
    event.player.tokens = tournament.divisions;

    return c.json(event);
  });

  app.get("/api/v1/events/Fortnite/:eventId/history/:accountId", async (c) => {
    var history: any = await Bun.file(
      "src/resources/events/history.json"
    ).json();
    history[0].scoreKey.eventId = c.req.param("eventId");
    history[0].teamId = c.req.param("accountId");
    history[0].teamAccountIds.push(c.req.param("accountId"));

    return c.json(history);
  });

  app.post("/fortnite/api/game/v2/events/v2/setSubgroup/*", async (c) => {
    return c.json([]);
  });

  app.get(
    "/api/v1/leaderboards/Fortnite/:eventId/:eventWindowId/:accountId",
    async (c) => {
      const event: any = await Bun.file(
        "src/resources/events/leaderboard.json"
      ).json();

      event.eventId = c.req.param("eventId");
      event.eventWindowId = c.req.param("eventWindowId");
      event.updatedTime = new Date().toISOString();

      event.entryTemplate.eventId = event.eventId;
      event.entryTemplate.eventWindowId = event.eventWindowId;
      event.entryTemplate.teamId = c.req.param("accountId");

      const users = await User.find({});

      event.entries = users.map((user: any) => ({
        teamId: user.accountId,
        displayNames: [user.displayName || "Unknown"],
        score: 2,
        rank: 1,
        pointBreakdown: {
          "PLACEMENT_STAT_INDEX:13": {
            timesAchieved: 1,
            pointsEarned: 2,
          },
        },
        sessionHistory: [
          {
            sessionId: v4(),
            endTime: new Date().toISOString(),
            trackedStats: {
              PLACEMENT_STAT_INDEX: 1,
              GainedHealthTimes: 1,
              TIME_ALIVE_STAT: 1,
              MATCH_PLAYED_STAT: 1,
              PLACEMENT_TIEBREAKER_STAT: 1,
              DamageDealt: 1,
              DamageReceived: 1,
              VICTORY_ROYALE_STAT: 1,
              Headshots: 1,
              Travel_Distance_Ground: 1,
              TEAM_ELIMS_STAT_INDEX: 1,
              GainedShieldTimes: 1,
            },
          },
        ],
      }));

      return c.json(event);
    }
  );
}
