import app from "../../..";
import Profiles from "../../../db/models/profiles";
import { applyProfileChanges } from "../../../utils/handling/applyProfileChanges";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/RemoveGiftBox",
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

        const body = await c.req.json();

        if (body.giftBoxItemIds) {
          delete profile.items[body.giftBoxItemIds];
        }

        if (body.giftBoxItemId) {
          delete profile.items[body.giftBoxItemId];
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        const response = await applyProfileChanges(
          profile,
          profileId,
          profiles
        );

        return c.json(response);
      } catch (error) {
        console.error(error);
      }
    }
  );
}
