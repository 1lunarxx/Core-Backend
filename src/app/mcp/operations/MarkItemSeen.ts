import app from "../../..";
import Profiles from "../../../db/models/profiles";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/MarkItemSeen",
    async (c) => {
      try {
        const profileId = c.req.query("profileId") ?? "athena";

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
        const { itemIds } = body;

        for (const itemId of itemIds as string[]) {
          if (profile.items[itemId]) {
            profile.items[itemId].attributes.item_seen = true;
            ApplyProfileChanges.push({
              changeType: "itemAttrChanged",
              itemId,
              attributeName: "item_seen",
              attributeValue: profile.items[itemId].attributes.item_seen,
            });
          }
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

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
