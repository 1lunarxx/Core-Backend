import app from "../..";
import { getVersion } from "../../utils/handling/getVersion";

export default function () {
  app.get("/fortnite/api/calendar/v1/timeline", async (c) => {
    const date = new Date();
    date.setHours(24, 0, 0, 0);

    const midnight = new Date(date.getTime() - 60000);
    const ver = await getVersion(c);

    return c.json({
      channels: {
        "client-matchmaking": {
          states: [],
          cacheExpire: "9999-01-01T22:28:47.830Z",
        },
        "client-events": {
          states: [
            {
              validFrom: new Date().toISOString(),
              activeEvents: [
                {
                  eventType: `EventFlag.Season${ver.build}`,
                  activeUntil: "9999-01-01T00:00:00.000Z",
                  activeSince: new Date().toISOString(),
                },
                {
                  eventType: `EventFlag.LobbySeason${ver.build}`,
                  activeUntil: "9999-01-01T00:00:00.000Z",
                  activeSince: new Date().toISOString(),
                },
                {
                  eventType: "EventFlag.LTE_BlackMonday",
                  activeUntil: "9999-01-01T00:00:00.000Z",
                  activeSince: new Date().toISOString(),
                },
              ],
              state: {
                activeStorefronts: [],
                eventNamedWeights: {},
                seasonNumber: ver.build,
                seasonTemplateId: `AthenaSeason:athenaseason${ver.build}`,
                matchXpBonusPoints: 0,
                eventPunchCardTemplateId: "",
                seasonBegin: new Date().toISOString(),
                seasonEnd: "9999-01-01T14:00:00Z",
                seasonDisplayedEnd: "9999-01-01T07:30:00Z",
                weeklyStoreEnd: midnight.toISOString(),
                stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                sectionStoreEnds: {
                  Featured: midnight.toISOString(),
                },
                dailyStoreEnd: midnight.toISOString(),
              },
            },
          ],
          cacheExpire: "9999-01-01T22:28:47.830Z",
        },
      },
      eventsTimeOffsetHrs: 0,
      cacheIntervalMins: 10,
      currentTime: new Date().toISOString(),
    });
  });
}
