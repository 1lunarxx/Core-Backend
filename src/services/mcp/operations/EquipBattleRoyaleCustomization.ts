import app from "../../..";
import Profiles from "../../../database/models/Profiles";
import { applyProfileChanges } from "ares-library";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/EquipBattleRoyaleCustomization",
    async (c) => {
      try {
        const profileId = c.req.query("profileId") ?? "athena";

        const body: {
          itemToSlot: string;
          slotName: keyof typeof mainSlots | "Dance" | "ItemWrap";
          indexWithinSlot?: number;
          variantUpdates?: Array<{
            channel: string;
            active: any;
            owned?: any[];
          }>;
        } = await c.req.json();

        const profiles: any = await Profiles.findOne({
          accountId: c.req.param("accountId"),
        });

        if (!profiles || !profiles.profiles[profileId] || !body) {
          return c.json({
            profileRevision: 0,
            profileId,
            profileChangesBaseRevision: 0,
            profileChanges: [],
            profileCommandRevision: 0,
            serverTime: new Date().toISOString(),
            multiUpdate: [],
            responseVersion: 1,
          });
        }

        const profile = profiles.profiles[profileId];
        const { itemToSlot, slotName, variantUpdates } = body;
        let ApplyProfileChanges: any[] = [];

        const mainSlots: { [key: string]: string } = {
          Character: "favorite_character",
          Backpack: "favorite_backpack",
          Pickaxe: "favorite_pickaxe",
          Glider: "favorite_glider",
          SkyDiveContrail: "favorite_skydivecontrail",
          LoadingScreen: "favorite_loadingscreen",
          MusicPack: "favorite_musicpack",
        };

        if (slotName in mainSlots) {
          profile.stats.attributes[mainSlots[slotName] || ""] = itemToSlot;
        }

        const isDance = slotName === "Dance";
        const cosmeticSlot = isDance ? "favorite_dance" : "favorite_itemwraps";
        if (slotName === "Dance" || slotName === "ItemWrap") {
          let items: string[] = profile.stats.attributes[cosmeticSlot] || [];
          if (body.indexWithinSlot === -1) {
            items = Array(isDance ? 6 : 7).fill(itemToSlot);
          } else {
            items[body.indexWithinSlot || 0] = itemToSlot;
          }
          profile.stats.attributes[cosmeticSlot] = items.filter(Boolean);
          ApplyProfileChanges.push({
            changeType: "statModified",
            name: cosmeticSlot,
            value: items,
          });
        }

        if (Array.isArray(variantUpdates)) {
          profile.items[itemToSlot] = profile.items[itemToSlot] || {
            attributes: { variants: [] },
          };
          variantUpdates.forEach(
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
