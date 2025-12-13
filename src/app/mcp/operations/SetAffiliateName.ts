import app from "../../..";
import Profiles from "../../../db/models/profiles";
import { applyProfileChanges } from "../../../utils/handling/applyProfileChanges";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/SetAffiliateName",
    async (c) => {
      try {
        const { profileId, rvn } = c.req.query();
        var profiles: any = await Profiles.findOne({
          accountId: c.req.param("accountId"),
        });

        let profile = profiles?.profiles[profileId ?? "common_core"];
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

        const body = await c.req.json();
        const { affiliateName } = body;

        profile.stats.attributes.mtx_affiliate = affiliateName;
        profile.stats.attributes.mtx_affiliate_set_time =
          new Date().toISOString();

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        const response = await applyProfileChanges(
          profile,
          profileId ?? "common_core",
          profiles
        );

        return c.json(response);
      } catch (error) {
        console.error(error);
      }
    }
  );
}
