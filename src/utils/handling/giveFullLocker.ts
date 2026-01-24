import Profiles from "../../database/models/Profiles";
import path from "path";

export async function giveFullLocker(accountId: any) {
  const profiles = await Profiles.findOne({ accountId: accountId });
  let profile = profiles?.profiles["athena"];

  const allItems = require(
    path.join(
      __dirname,
      "..",
      "..",
      "resources",
      "utilities",
      "allCosmetics.json",
    ),
  );
  profile.items = { ...profile.items, ...allItems };

  await profiles?.updateOne({
    $set: { "profiles.athena.items": profile.items },
  });
}
