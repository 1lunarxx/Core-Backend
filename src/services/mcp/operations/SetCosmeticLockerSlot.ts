import app from "../../..";
import Profiles from "../../../database/models/Profiles";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerSlot",
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
        let { lockerItem, category, itemToSlot, slotIndex } = body;

        lockerItem = profile.items[lockerItem];

        if (category === "Character") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.Character.items = [itemToSlot];
        }

        if (category === "Pickaxe") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.Pickaxe.items = [itemToSlot];
        }

        if (category === "Glider") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.Glider.items = [itemToSlot];
        }

        if (category === "Dance") {
          let item =
            profile.items[body.lockerItem].attributes.locker_slots_data.slots
              .Dance.items;

          if (
            Array.isArray(item) &&
            typeof slotIndex === "number" &&
            slotIndex >= 0 &&
            slotIndex < item.length
          ) {
            item[slotIndex] = itemToSlot;
          }
        }

        if (category === "Backpack") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.Backpack.items = [itemToSlot];
        }

        if (category === "ItemWrap") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.ItemWrap.items = [itemToSlot];
        }

        if (category === "LoadingScreen") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.LoadingScreen.items = [
            itemToSlot,
          ];
        }

        if (category === "MusicPack") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.MusicPack.items = [itemToSlot];
        }

        if (category === "SkyDiveContrail") {
          profile.items[
            body.lockerItem
          ].attributes.locker_slots_data.slots.SkyDiveContrail.items = [
            itemToSlot,
          ];
        }

        if (itemToSlot.length == 0) {
          profile.items[body.lockerItem].attributes.locker_slots_data.slots[
            category
          ].items = [""];
        }

        if (Array.isArray(body.variantUpdates)) {
          profile.items[itemToSlot] = profile.items[itemToSlot] || {
            attributes: { variants: [] },
          };
          body.variantUpdates.forEach(
            (variant: { channel: string; active: any; owned?: any[] }) => {
              if (variant.channel && variant.active) {
                const index = profile.items[
                  itemToSlot
                ].attributes.variants.findIndex(
                  (x: { channel: string }) => x.channel === variant.channel
                );
                if (index === -1) {
                  profile.items[itemToSlot].attributes.variants.push(variant);
                } else {
                  profile.items[itemToSlot].attributes.variants[index].active =
                    variant.active;
                }
              }
            }
          );

          ApplyProfileChanges.push({
            changeType: "itemAttrChanged",
            itemId: itemToSlot,
            attributeName: "variants",
            attributeValue: profile.items[itemToSlot].attributes.variants,
          });
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        ApplyProfileChanges.push({
          changeType: "itemAttrChanged",
          itemId: body.lockerItem,
          attributeName: "locker_slots_data",
          attributeValue:
            profile.items[body.lockerItem].attributes.locker_slots_data,
        });

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
