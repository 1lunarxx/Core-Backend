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
