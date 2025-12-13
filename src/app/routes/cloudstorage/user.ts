import app from "../../..";
import crypto from "crypto";
import path from "node:path";
import User from "../../../db/models/user";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

export default function () {
  app.get("/fortnite/api/cloudstorage/user/:accountId/:file", async (c) => {
    const clientSettings: string = path.join(
      process.env.LOCALAPPDATA as string,
      "Core",
      "ClientSettings"
    );

    if (!existsSync(clientSettings)) await mkdir(clientSettings);

    const file = c.req.param("file");
    const user = await User.findOne({ accountId: c.req.param("accountId") });

    const clientSettingsFile = path.join(
      clientSettings,
      `ClientSettings-${user?.accountId}.Sav`
    );

    if (file !== "ClientSettings.Sav" || !existsSync(clientSettingsFile))
      return c.json({ error: "File not found." }, 404);

    const data = await readFile(clientSettingsFile);

    try {
      return c.body(data as any);
    } catch (err) {
      return c.json({ error: "Error reading file." }, 500);
    }
  });

  app.get("/fortnite/api/cloudstorage/user/:accountId", async (c) => {
    const clientSettings: string = path.join(
      process.env.LOCALAPPDATA as string,
      "Core",
      "ClientSettings"
    );
    if (!existsSync(clientSettings)) {
      try {
        await mkdir(clientSettings, { recursive: true });
      } catch (err) {
        console.error(`Error creating directory: ${err}`);
      }
    }
    const user = await User.findOne({ accountId: c.req.param("accountId") });

    const clientSettingsFile = path.join(
      clientSettings,
      `ClientSettings-${user?.accountId}.Sav`
    );

    if (existsSync(clientSettingsFile)) {
      const file = await readFile(clientSettingsFile, "latin1");
      const stats = await stat(clientSettingsFile);

      return c.json([
        {
          uniqueFilename: "ClientSettings.Sav",
          filename: "ClientSettings.Sav",
          hash: crypto.createHash("sha1").update(file).digest("hex"),
          hash256: crypto.createHash("sha256").update(file).digest("hex"),
          length: Buffer.byteLength(file),
          contentType: "application/octet-stream",
          uploaded: stats.mtime,
          storageType: "S3",
          storageIds: {},
          accountId: user?.accountId,
          doNotCache: false,
        },
      ]);
    }

    return c.json([]);
  });

  app.put("/fortnite/api/cloudstorage/user/:accountId/:file", async (c) => {
    const raw = await c.req.arrayBuffer();
    const body = Buffer.from(raw);

    if (Buffer.byteLength(body) >= 400000)
      return c.json({ error: "File too large." }, 400);

    if (c.req.param("file") !== "ClientSettings.Sav")
      return c.json({ error: "Invalid file." }, 400);

    const clientSettings: string = path.join(
      process.env.LOCALAPPDATA as string,
      "Core",
      "ClientSettings"
    );
    if (!existsSync(clientSettings)) await mkdir(clientSettings);

    const clientSettingsFile = path.join(
      clientSettings,
      `ClientSettings-${c.req.param("accountId")}.Sav`
    );

    await writeFile(clientSettingsFile, new Uint8Array(body), "latin1");
    return c.json([]);
  });
}
