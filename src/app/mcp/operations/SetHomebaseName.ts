import app from "../../..";
import Profiles from "../../../db/models/profiles";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/SetHomebaseName",
    async (c) => {
      try {
        const profileId = c.req.query("profileId") ?? "common_public";

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

        let BaseRevision = profile.rvn;
        let MultiUpdate: any = [];
        let ApplyProfileChanges: any = [];

        const body = await c.req.json();
        const { homebaseName } = body;

        if (homebaseName) {
          if (profileId == "profile0") {
            profile.stats.attributes.homebase.townName = homebaseName;
          }

          if (profileId == "common_public") {
            profile.stats.attributes.homebase_name = homebaseName;
          }
        }

        if (profileId == "profile0") {
          ApplyProfileChanges.push({
            changeType: "statModified",
            name: "homebase",
            value: profile.stats.attributes.homebase,
          });
        }

        if (profileId == "common_public") {
          ApplyProfileChanges.push({
            changeType: "statModified",
            name: "homebase_name",
            value: profile.stats.attributes.homebase_name,
          });
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();
        ApplyProfileChanges = [
          {
            changeType: "fullProfileUpdate",
            profile: profile,
          },
        ];

        await profiles.updateOne({
          $set: { [`profiles.${profileId}`]: profile },
        });

        return c.json({
          profileRevision: profile.rvn || 0,
          profileId: profileId,
          profileChangesBaseRevision: BaseRevision,
          profileChanges: ApplyProfileChanges,
          profileCommandRevision: profile.rvn,
          serverTime: new Date().toISOString(),
          multiUpdate: MultiUpdate,
          responseVersion: 1,
        });
      } catch (error) {
        console.error(error);
      }
    }
  );
}
