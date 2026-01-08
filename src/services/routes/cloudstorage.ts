import app from "../..";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import User from "../../database/models/User";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

export default function () {
  app.get("/fortnite/api/cloudstorage/system/config", async (c) => {
    const response: any[] = [];

    const hotfixStatic = path.join(
      import.meta.dir,
      "..",
      "..",
      "..",
      "static",
      "hotfixes"
    );

    if (!fs.existsSync(hotfixStatic)) {
      return c.json([]);
    }

    const files = fs.readdirSync(hotfixStatic).sort();

    for (const file of files) {
      const hotfixPath = path.join(hotfixStatic, file);

      if (!fs.statSync(hotfixPath).isFile()) continue;

      const buffer = fs.readFileSync(hotfixPath);

      response.push({
        uniqueFilename: file,
        filename: file,
        hash: crypto.createHash("sha1").update(buffer).digest("hex"),
        hash256: crypto.createHash("sha256").update(buffer).digest("hex"),
        length: buffer.length,
        contentType: "application/octet-stream",
        uploaded: new Date().toISOString(),
        storageType: "DSS",
        doNotCache: false,
      });
    }

    return c.json(response);
  });

  app.get("/fortnite/api/cloudstorage/system", async (c) => {
    let response: any[] = [];
    const hotfixStatic = path.resolve("static/hotfixes");

    if (fs.existsSync(hotfixStatic)) {
      const files = fs.readdirSync(hotfixStatic);

      for (const file of files) {
        const hotfixPath = path.join(hotfixStatic, file);
        const hotfix = fs.statSync(hotfixPath);

        if (!hotfix.isFile()) continue;

        const buffer = fs.readFileSync(hotfixPath);
        const hash = crypto.createHash("sha1").update(buffer).digest("hex");

        const hash256 = crypto
          .createHash("sha256")
          .update(buffer)
          .digest("hex");

        response.push({
          uniqueFilename: file,
          filename: file,
          hash: hash,
          hash256: hash256,
          length: 59,
          contentType: "application/octet-stream",
          uploaded: new Date().toISOString(),
          storageType: "DSS",
          doNotCache: false,
        });
      }
    }

    return c.json(response);
  });

  app.get("/fortnite/api/cloudstorage/system/:file", async (c) => {
    const file = c.req.param("file");
    if (!file.includes("Default")) {
      return c.json([], 404);
    }

    const hotfixStatic = path.resolve("static/hotfixes");
    const files = fs.readdirSync(hotfixStatic);

    for (const hotfix of files) {
      if (hotfix == file) {
        const filePath = path.join(hotfixStatic, hotfix);
        const data = fs.readFileSync(filePath, "utf8");
        return c.text(data);
      }
    }

    return c.json({});
  });

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
