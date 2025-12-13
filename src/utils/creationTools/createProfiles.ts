import path from "path";
import fs from "fs";
import { Fortnite } from "fortnitenpm";

interface Profiles {
  [key: string]: Profiles;
}

export default async function createProfiles(accountId: any) {
  const profilesDir = path.join(__dirname, "../../resources/profiles");
  const files = fs.readdirSync(profilesDir);

  const profiles: Record<string, any> = {};

  for (const file of files) {
    const filePath = path.join(profilesDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(fileContent);

    parsed._id = accountId;
    parsed.createdAt = new Date().toISOString();
    parsed.updatedAt = new Date().toISOString();

    const ext = path.basename(file, path.extname(file));
    profiles[ext] = parsed;
  }

  return profiles;
}

export async function createProfilesFromBearer(bearer: string) {
  const fortnite = new Fortnite(bearer);
  const profiles: Profiles = {};

  try {
    const fetched = await fortnite.getProfile();
    const athena =
      fetched?.athena?.profileChanges?.[0]?.profile ||
      fetched?.profileChanges?.find(
        (p: any) => p.profile?.profileId === "athena"
      )?.profile ||
      fetched?.athena;
    const common_core =
      fetched?.common_core?.profileChanges?.[0]?.profile ||
      fetched?.profileChanges?.find(
        (p: any) => p.profile?.profileId === "common_core"
      )?.profile ||
      fetched?.common_core;

    if (athena) {
      delete athena._id;

      athena.version = "no_version";
      athena.rvn = 0;
      athena.commandRevision = 0;
      athena.wipeNumber = 0;

      if (!athena.stats) athena.stats = { attributes: {} };
      if (!athena.stats.attributes) athena.stats.attributes = {};

      athena.stats.attributes.past_seasons = [];
      athena.stats.attributes.loadouts = ["sandbox_loadout"];
      athena.stats.attributes.last_applied_loadout = "sandbox_loadout";
      athena.stats.attributes.active_loadout_index = 0;
      athena.stats.attributes.season_num = 12;
      athena.stats.attributes.book_purchased = true;

      if (!athena.items) athena.items = {};

      athena.items["sandbox_loadout"] = {
        templateId: "CosmeticLocker:cosmeticlocker_athena",
        attributes: {
          locker_slots_data: {
            slots: {
              Pickaxe: {
                items: ["AthenaPickaxe:DefaultPickaxe"],
                activeVariants: [],
              },
              Dance: { items: ["", "", "", "", "", ""] },
              Glider: { items: ["AthenaGlider:DefaultGlider"] },
              Character: { items: [] },
              Backpack: { items: [""], activeVariants: [{ variants: [] }] },
              ItemWrap: {
                items: ["", "", "", "", "", "", ""],
                activeVariants: [null, null, null, null, null, null, null],
              },
              LoadingScreen: { items: [""], activeVariants: [null] },
              MusicPack: { items: [""], activeVariants: [null] },
              SkyDiveContrail: { items: [""], activeVariants: [null] },
            },
          },
          use_count: 0,
          banner_icon_template: "",
          banner_color_template: "",
          locker_name: "",
          item_seen: false,
          favorite: false,
        },
        quantity: 1,
      };

      athena.items["Core0-loadout"] = {
        templateId: "CosmeticLocker:cosmeticlocker_athena",
        attributes: {
          locker_slots_data: {
            slots: {
              Pickaxe: {
                items: ["AthenaPickaxe:DefaultPickaxe"],
                activeVariants: [],
              },
              Dance: { items: ["", "", "", "", "", ""] },
              Glider: { items: ["AthenaGlider:DefaultGlider"] },
              Character: { items: [], activeVariants: [{ variants: [] }] },
              Backpack: { items: [""], activeVariants: [{ variants: [] }] },
              ItemWrap: {
                items: ["", "", "", "", "", "", ""],
                activeVariants: [null, null, null, null, null, null, null],
              },
              LoadingScreen: { items: [""], activeVariants: [null] },
              MusicPack: { items: [""], activeVariants: [null] },
              SkyDiveContrail: { items: [""], activeVariants: [null] },
            },
          },
          use_count: 0,
          banner_icon_template: "",
          banner_color_template: "",
          locker_name: "Core",
          item_seen: false,
          favorite: false,
        },
        quantity: 1,
      };
      profiles["athena"] = athena;
    }

    if (common_core) {
      delete common_core._id;

      common_core.version = "no_version";
      common_core.rvn = 0;
      common_core.commandRevision = 0;
      common_core.wipeNumber = 0;
      profiles["common_core"] = common_core;
    }

    return profiles;
  } catch (error) {}
}
