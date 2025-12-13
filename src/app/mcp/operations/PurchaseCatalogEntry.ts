import app from "../../..";
import Profiles from "../../../db/models/profiles";
import catalog from "../../../resources/storefront/catalog.json";
import path from "path";
import fs from "fs";
import { getVersion } from "../../../utils/handling/getVersion";
import { v4 } from "uuid";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry",
    async (c) => {
      try {
        const { profileId } = c.req.query();
        const profiles: any = await Profiles.findOne({
          accountId: c.req.param("accountId"),
        });
        if (!profiles || !profiles.profiles[profileId ?? "athena"]) {
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

        const profile = profiles.profiles[profileId ?? "athena"];
        const athena = profiles.profiles["athena"];
        const common_core = profiles.profiles["common_core"];

        const ApplyProfileChanges: any[] = [];
        const lootItems: any[] = [];
        const athenaChanges: any[] = [];

        const ver = getVersion(c);
        const body = await c.req.json();
        const { offerId, purchaseQuantity, expectedTotalPrice } = body;

        const offer = (catalog.storefronts as any[])
          .flatMap((s: any) => s.catalogEntries)
          .find((e: any) => e.offerId === offerId);

        if (!offer) return c.json({});

        if (offerId.includes("Athena")) {
          if (
            common_core.items["Currency:MtxPurchased"].quantity <
            expectedTotalPrice
          ) {
            return c.json({});
          }

          common_core.items["Currency:MtxPurchased"].quantity -=
            expectedTotalPrice;
          athena.items[offerId] = {
            attributes: {
              favorite: false,
              item_seen: false,
              level: 0,
              max_level_bonus: 0,
              rnd_sel_cnt: 0,
              variants: [],
              xp: 0,
            },
            quantity: purchaseQuantity,
            templateId: offerId,
          };

          athenaChanges.push({
            changeType: "itemAdded",
            itemId: offerId,
            item: athena.items[offerId],
          });

          ApplyProfileChanges.push({
            changeType: "itemQuantityChanged",
            itemId: "Currency:MtxPurchased",
            quantity: common_core.items["Currency:MtxPurchased"].quantity,
          });

          lootItems.push({
            itemType: offerId,
            itemGuid: offerId,
            itemProfile: "athena",
            quantity: purchaseQuantity,
          });
        }

        athena.rvn++;
        athena.commandRevision++;
        athena.updated = new Date().toISOString();
        common_core.rvn++;
        common_core.commandRevision++;
        common_core.updated = new Date().toISOString();

        await profiles.updateOne({
          $set: {
            [`profiles.${profileId}`]: profile,
            [`profiles.athena`]: athena,
            [`profiles.common_core`]: common_core,
          },
        });

        return c.json({
          profileRevision: common_core.rvn,
          profileId,
          profileChangesBaseRevision: common_core.rvn - 1,
          profileChanges: ApplyProfileChanges,
          notifications: [
            {
              type: "CatalogPurchase",
              primary: true,
              lootResult: { items: lootItems },
            },
          ],
          profileCommandRevision: common_core.commandRevision,
          serverTime: new Date().toISOString(),
          multiUpdate: [
            {
              profileRevision: athena.rvn,
              profileId: "athena",
              profileChangesBaseRevision: athena.rvn - 1,
              profileChanges: athenaChanges,
              profileCommandRevision: athena.commandRevision,
            },
          ],
          responseVersion: 1,
        });
      } catch (error) {
        return c.json({});
      }
    }
  );
}
