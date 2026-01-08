import app from "../../..";
import Profiles from "../../../database/models/Profiles";

export default function () {
  app.post(
    "/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerBanner",
    async (c) => {
      try {
        const profileId = c.req.query("profileId") ?? "athena";

        var profiles: any = await Profiles.findOne({
          accountId: c.req.param("accountId"),
        });
        let profile = profiles?.profiles["athena"];
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

        const { lockerItem, bannerIconTemplateName, bannerColorTemplateName } =
          body;

        profile.items[lockerItem].attributes.banner_color_template =
          bannerColorTemplateName;
        profile.items[lockerItem].attributes.banner_icon_template =
          bannerIconTemplateName;

        ApplyProfileChanges.push({
          changeType: "itemAttrChanged",
          itemId: body.lockerItem,
          attributeName: "banner_color_template",
          attributeValue: bannerColorTemplateName,
        });

        ApplyProfileChanges.push({
          changeType: "itemAttrChanged",
          itemId: body.lockerItem,
          attributeName: "banner_icon_template",
          attributeValue: bannerIconTemplateName,
        });

        ApplyProfileChanges = [
          {
            changeType: "fullProfileUpdate",
            profile: profile,
          },
        ];

        await profiles.updateOne({
          $set: { [`profiles.athena`]: profile },
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
