import app from "../../..";
import Profiles from "../../../db/models/profiles";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/RedeemRealMoneyPurchases",
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

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        ApplyProfileChanges.push({
          changeType: "statModified",
          name: "in_app_purchases",
          value: {
            receipts: [],
            ignoredReceipts: [],
            fulfillmentCounts: {},
            refreshTimers: {
              MicrosoftStore: {
                nextEntitlementRefresh: "9999-12-01T21:10:00.000Z",
              },
              SamsungGalaxyAppStore: {},
              EpicPurchasingService: {
                nextEntitlementRefresh: "9999-12-01T21:10:00.000Z",
              },
            },
            version: 1,
          },
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
