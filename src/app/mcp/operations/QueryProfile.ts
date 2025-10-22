import app from "../../..";
import Profiles from "../../../db/models/Profiles";
import { applyProfileChanges } from "../../../utils/handling/applyProfileChanges";
import { getVersion } from "../../../utils/handling/getVersion";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/QueryProfile",
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

      console.log((await getVersion(c)).build.toString());

      if (profileId == "athena") {
        profile.stats.attributes.season_num = (
          await getVersion(c)
        ).build.toString();
      }

      const response = await applyProfileChanges(profile, profileId, profiles);

      return c.json(response);
    }
  );
}
