import app from "../../..";
import Profiles from "../../../db/models/profiles";
import { applyProfileChanges } from "../../../utils/handling/applyProfileChanges";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/RefreshExpeditions",
    async (c) => {
      const profileId = c.req.query("profileId") ?? "athena";

      var profiles: any = await Profiles.findOne({
        accountId: c.req.param("accountId"),
      });
      let profile = profiles?.profiles[profileId || ""];
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

      const response = await applyProfileChanges(
        profile,
        profileId || "athena",
        profiles
      );

      return c.json(response);
    }
  );
}
