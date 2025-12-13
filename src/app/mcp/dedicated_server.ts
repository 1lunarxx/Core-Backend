import app from "../..";
import Profiles from "../../db/models/profiles";
import { applyProfileChanges } from "../../utils/handling/applyProfileChanges";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/dedicated_server/QueryProfile",
    async (c) => {
      let profileId = c.req.query("profileId") ?? "athena";
      var profiles: any = await Profiles.findOne({
        accountId: c.req.param("accountId"),
      });

      let profile = profiles?.profiles[profileId];
      if (!profile || !profiles) {
        return c.json({
          profileRevision: 0,
          profileId: profileId,
          profileChangesBaseRevision: 0,
          profileChanges: [],
          profileCommandRevision: 0,
          serverTime: new Date().toISOString(),
          multiUpdate: [],
          responseVersion: 1,
        });
      }

      if (!profile && profileId !== "athena" && profileId !== "common_core") {
        return c.json({
          profileRevision: profile.rvn || 0,
          profileId: profileId,
        });
      }

      const response = await applyProfileChanges(profile, profileId, profiles);

      return c.json(response);
    }
  );

  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/QueryProfile",
    async (c) => {
      let profileId = c.req.query("profileId") ?? "athena";
      var profiles: any = await Profiles.findOne({
        accountId: c.req.param("accountId"),
      });
      let profile = profiles?.profiles[profileId];
      if (!profile || !profiles) {
        return c.json({
          profileRevision: 0,
          profileId: profileId,
          profileChangesBaseRevision: 0,
          profileChanges: [],
          profileCommandRevision: 0,
          serverTime: new Date().toISOString(),
          multiUpdate: [],
          responseVersion: 1,
        });
      }

      if (!profile && profileId !== "athena" && profileId !== "common_core") {
        return c.json({
          profileRevision: profile.rvn || 0,
          profileId: profileId,
        });
      }

      const response = await applyProfileChanges(profile, profileId, profiles);

      return c.json(response);
    }
  );
}
