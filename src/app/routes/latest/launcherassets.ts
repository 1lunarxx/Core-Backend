import axios from "axios";
import app from "../../..";
import { getVersion } from "../../../utils/handling/getVersion";

export default function () {
  app.get(
    "/launcher/api/public/assets/:platform/:catalogItemId/:appName",
    async (c) => {
      const appName = c.req.param("appName");
      const catalogItemId = c.req.param("catalogItemId");
      const platform = c.req.param("platform");
      const label = c.req.query("label");

      if (platform == "IOS") {
        // testing
        return c.json({
          appName: "FortniteContentBuilds",
          labelName: "Live-IOS",
          buildVersion: "++Fortnite+Release-13.40-CL-14009477",
          catalogItemId: "5cb97847cee34581afdbc445400e2f77",
          expires: "9999-12-31T23:59:59.999Z",
          items: {
            MANIFEST: {
              signature: "Live-IOS",
              distribution: "https://epicgames-download1.akamaized.net/",
              path: "Builds/Fortnite/Content/CloudDir/JmM_VK6UrqDNG3RaqEiTugrfjK03Ag.manifest",
              hash: "da957eaf200ca9e1a0da301f62ca53cd22f10aba",
              additionalDistributions: [],
            },
            CHUNKS: {
              signature: "Live-IOS",
              distribution: "https://epicgames-download1.akamaized.net/",
              path: "Builds/Fortnite/Content/CloudDir/JmM_VK6UrqDNG3RaqEiTugrfjK03Ag.manifest",
              additionalDistributions: [],
            },
          },
          assetId: "FortniteContentBuilds",
        });
      }

      return c.json({
        appName: appName,
        labelName: `${label}-${platform}`,
        buildVersion: `27.11`, // for example, maybe add proper later!,
        catalogItemId: catalogItemId,
        expires: "9999-09-23T23:59:59.999Z",
        items: {
          MANIFEST: {
            signature: "core",
            distribution: `http://localhost:${process.env.PORT}/`,
            path: `Builds/Fortnite/Content/CloudDir/Core.manifest`,
            additionalDistributions: [],
          },
        },
        assetId: appName,
      });
    }
  );
}
