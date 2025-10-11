import { v4 as uuid } from "uuid";
import app from "../../..";
import Profiles from "../../../db/models/Profiles";
import { getVersion } from "../../../utils/handling/getVersion";
import fs from "fs";
import path from "path";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin",
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

      const ver = await getVersion(c);
      if (!ver) {
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

      let MultiUpdate: any = [];
      let BaseRevision = profile.rvn;
      let ApplyProfileChanges: any = [];

      const repeatablesPath = path.resolve(
        __dirname,
        "../../../resources/quests/repeatables"
      );

      const dailyFiles = fs.readdirSync(repeatablesPath).slice(0, 3);

      if (process.env.WEEKLY == "true") {
        const weeklys = await Bun.file(
          `src/resources/quests/weekly/Season${ver.build}/QuestBundle_S${ver.build}_Week_001.json`
        ).json();
        const bundleName = `ChallengeBundle:${weeklys.Name}`;
        const objectiveStates: Record<string, number> = {};

        for (const { BackendName, Stage } of weeklys.Objectives) {
          objectiveStates[`completion_${BackendName}`] = Stage;
        }

        const weekly = {
          templateId: weeklys.Name,
          attributes: {
            creation_time: new Date().toISOString(),
            level: -1,
            item_seen: false,
            playlists: [],
            sent_new_notification: true,
            challenge_bundle_id: bundleName,
            xp_reward_scalar: 1,
            quest_state: "Active",
            last_state_change_time: new Date().toISOString(),
            quest_rarity: "uncommon",
            favorite: false,
            ...objectiveStates,
          },
          quantity: 1,
        };

        profile.items[weeklys.Name] = weekly;
        MultiUpdate.push({
          changeType: "itemAdded",
          itemId: weeklys.Name,
          item: weekly,
        });
      }

      for (const file of dailyFiles) {
        const filePath = path.join(repeatablesPath, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const id = uuid();
        if (!profile.items) {
          return c.json({ error: "Somehow cooked.." });
        }

        if (
          Object.values(profile.items).some(
            (item: any) => item.templateId === `Quest:${content.Name}`
          )
        ) {
          continue;
        }

        const item = {
          templateId: `Quest:${content.Name}`,
          attributes: {
            creation_time: new Date().toISOString(),
            level: -1,
            item_seen: false,
            playlists: [],
            sent_new_notification: true,
            challenge_bundle_id: "",
            xp_reward_scalar: 1,
            challenge_linked_quest_given: "",
            quest_pool: "",
            quest_state: "Active",
            bucket: "",
            last_state_change_time: new Date().toISOString(),
            challenge_linked_quest_parent: "",
            max_level_bonus: 0,
            xp: 0,
            quest_rarity: "uncommon",
            favorite: false,
            [`completion_${content.Properties.Objectives[0].BackendName}`]: 0,
          },
          quantity: 1,
        };

        profile.items[id] = item;

        MultiUpdate.push({
          changeType: "itemAdded",
          itemId: id,
          item: item,
        });
      }

      profile.rvn += 1;
      profile.commandRevision += 1;
      profile.updated = new Date().toISOString();

      await profiles.updateOne({
        $set: {
          [`profiles.athena`]: profile,
        },
      });

      return c.json({
        profileRevision: profile.rvn,
        profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision,
        serverTime: new Date().toISOString(),
        multiUpdate: MultiUpdate,
        responseVersion: 1,
      });
    }
  );
}
