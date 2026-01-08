import app from "../../..";
import Profiles from "../../../database/models/Profiles";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/SetItemFavoriteStatusBatch",
    async (c) => {
      const profileId = c.req.query("profileId") ?? "athena";

      var profiles: any = await Profiles.findOne({
        accountId: c.req.param("accountId"),
      });
      let profile = profiles?.profiles[profileId || "athena"];
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
      const { itemIds, itemFavStatus } = body;

      for (const item of itemIds) {
        profile.items[item].attributes.favorite = itemFavStatus;
        ApplyProfileChanges.push({
          changeType: "itemAttrChanged",
          item,
          attributeName: "favorite",
          attributeValue: profile.items[item].attributes.favorite,
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
    }
  );
}
