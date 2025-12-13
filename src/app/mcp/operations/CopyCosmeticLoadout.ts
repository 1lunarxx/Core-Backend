import app from "../../..";
import Profiles from "../../../db/models/profiles";
import { applyProfileChanges } from "../../../utils/handling/applyProfileChanges";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/CopyCosmeticLoadout",
    async (c) => {
      try {
        const { profileId } = c.req.query();
        var profiles: any = await Profiles.findOne({
          accountId: c.req.param("accountId"),
        });
        let profile = profiles?.profiles[profileId ?? "athena"];
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
        const { optNewNameForTarget, sourceIndex, targetIndex } = body;

        let item;

        if (sourceIndex === 0) {
          const targetKey = `Core${targetIndex - 1}-loadout`;
          item = profile.items[targetKey];
          if (!item) {
            profile.items[targetKey] = JSON.parse(
              JSON.stringify(profile.items["sandbox_loadout"])
            );
          }

          if (optNewNameForTarget && optNewNameForTarget !== "") {
            profile.items[targetKey].attributes["locker_name"] =
              optNewNameForTarget;
          }

          const item2 = profile.items[targetKey];
          profile.items["sandbox_loadout"].attributes["locker_slots_data"] =
            item2.attributes["locker_slots_data"];
          profile.stats.attributes.loadouts[targetIndex] = targetKey;
          profile.stats.attributes["active_loadout_index"] = targetIndex;
          profile.stats.attributes["last_applied_loadout"] = targetKey;
        } else {
          const sourceKey = `Core${sourceIndex - 1}-loadout`;
          item = profile.items[sourceKey];
          profile.stats.attributes["active_loadout_index"] = sourceIndex;
          profile.stats.attributes["last_applied_loadout"] = sourceKey;
          profile.items["sandbox_loadout"].attributes["locker_slots_data"] =
            item.attributes["locker_slots_data"];
          const name = item.attributes["locker_name"];
          profile.items[sourceKey] = JSON.parse(
            JSON.stringify(profile.items["sandbox_loadout"])
          );
          profile.items[sourceKey].attributes["locker_name"] = name;
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        const response = await applyProfileChanges(
          profile,
          profileId ?? "athena",
          profiles
        );
        return c.json(response);
      } catch (error) {
        console.error(error);
        return c.json({ error: error }, 500);
      }
    }
  );
}
