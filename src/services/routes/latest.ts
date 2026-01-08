import axios from "axios";
import app from "../..";
import { config } from "../..";
import { getVersion } from "../../utils/handling/getVersion";
import fs from "fs";
import path from "path";

export default function () {
  app.post("/publickey/v2/publickey", async (c) => {
    return c.json([]);
  });

  app.get(
    "/launcher/api/public/assets/:platform/:catalogItemId/:appName",
    async (c) => {
      const appName = c.req.param("appName");
      const catalogItemId = c.req.param("catalogItemId");
      const platform = c.req.param("platform");
      const label = c.req.query("label");

      const ver = await getVersion(c);

      return c.json({
        appName: appName,
        labelName: `${label}-${platform}`,
        buildVersion: ver.cl,
        catalogItemId: catalogItemId,
        expires: "9999-09-23T23:59:59.999Z",
        items: {
          MANIFEST: {
            signature: "core",
            distribution: `http://localhost:${config.get("port")}/`,
            path: `Builds/Fortnite/Content/CloudDir/Core.manifest`,
            additionalDistributions: [],
          },
        },
        assetId: appName,
      });
    }
  );

  app.get("/hotconfigs/v2/livefn.json", async (c) => {
    return c.json({
      HotConfigData: [
        {
          AppId: "livefn",
          EpicApp: "FortniteLivefn",
          Modules: [
            {
              ModuleName: "GameServiceMcp",
              Endpoints: {
                Android: "fngw-mcp-gc-livefn.ol.epicgames.com",
                DedicatedServer: "fngw-mcp-ds-livefn.ol.epicgames.com",
                Default: "fngw-mcp-gc-livefn.ol.epicgames.com",
                IOS: "fngw-mcp-gc-livefn.ol.epicgames.com",
                Linux: "fngw-mcp-gc-livefn.ol.epicgames.com",
                Mac: "fngw-mcp-gc-livefn.ol.epicgames.com",
                PS4: "fngw-mcp-gc-livefn.ol.epicgames.com",
                PS5: "fngw-mcp-gc-livefn.ol.epicgames.com",
                Switch: "fngw-mcp-gc-livefn.ol.epicgames.com",
                Windows: "fngw-mcp-gc-livefn.ol.epicgames.com",
                XB1: "fngw-mcp-gc-livefn.ol.epicgames.com",
                XSX: "fngw-mcp-gc-livefn.ol.epicgames.com",
                XboxOneGDK: "fngw-mcp-gc-livefn.ol.epicgames.com",
              },
            },
          ],
        },
      ],
    });
  });

  app.get("/Builds/Fortnite/Content/CloudDir/*", async (c: any) => {
    c.header("Content-Type", "application/octet-stream");

    const manifest: any = await fs.promises.readFile(
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "static",
        "assets",
        "Core.manifest"
      )
    );
    return c.body(manifest);
  });

  app.get("/Builds/Fortnite/Content/CloudDir/*.ini", async (c: any) => {
    const ini: any = fs.readFileSync(
      path.join(__dirname, "..", "..", "..", "static", "assets", "stuff.ini")
    );
    return c.body(ini);
  });

  app.get(
    "/Builds/Fortnite/Content/CloudDir/ChunksV4/:chunknum/*",
    async (c) => {
      const res = await axios.get(
        `https://epicgames-download1.akamaized.net${c.req.path}`,
        {
          responseType: "stream",
        }
      );
      c.header("Content-Type", "application/octet-stream");

      return c.body(res.data);
    }
  );
}
