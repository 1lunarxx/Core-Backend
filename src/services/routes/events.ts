import app from "../..";
import Tournaments from "../../database/models/Tournaments";
import User from "../../database/models/User";
import { getVersion } from "../../utils/getVersion";
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
    var history: any = [
      {
        scoreKey: {
          gameId: "Fortnite",
          eventId: c.req.param("eventId"),
          eventWindowId: "corelg_cup1",
          _scoreId: null,
        },
        teamId: c.req.param("accountId"),
        teamAccountIds: [c.req.param("accountId")],
        liveSessionId: null,
        pointsEarned: 0,
        score: 0,
        rank: 1,
        percentile: 0,
        pointBreakdown: {
          "TEAM_ELIMS_STAT_INDEX:1": {
            timesAchieved: 1,
            pointsEarned: 0,
          },
          "PLACEMENT_STAT_INDEX:2": {
            timesAchieved: 1,
            pointsEarned: 0,
          },
        },
        sessionHistory: [{}],
        unscoredSessions: [],
      },
    ];

    return c.json(history);
  });

  app.post("/fortnite/api/game/v2/events/v2/setSubgroup/*", async (c) => {
    return c.json([]);
  });

  app.get(
    "/api/v1/leaderboards/Fortnite/:eventId/:eventWindowId/:accountId",
    async (c) => {
      const event: any = {
        gameId: "Fortnite",
        eventId: c.req.param("eventId"),
        eventWindowId: c.req.param("eventWindowId"),
        page: 0,
        totalPages: 1,
        updatedTime: new Date().toISOString(),
        entryTemplate: {
          gameId: "Fortnite",
          eventId: c.req.param("eventId"),
          eventWindowId: c.req.param("eventWindowId"),
          teamAccountIds: [],
          pointsEarned: 1,
          score: 1.0,
          rank: 1,
          percentile: 0.1,
          tokens: ["GroupIdentity_GeoIdentity_fortnite"],
          teamId: c.req.param("accountId"),
          liveSessionId: null,
          pointBreakdown: {},
          sessionHistory: [],
        },
        entries: [],
        liveSessions: {},
      };

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
    },
  );
}
