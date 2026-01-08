import app from "../..";

export default function () {
  app.get("/fortnite/api/storefront/v2/keychain", async (c) => {
    const keychain = await Bun.file(
      "src/resources/storefront/keychain.json"
    ).json();

    return c.json(keychain);
  });

  app.get("/fortnite/api/storefront/v2/catalog", async (c) => {
    const catalog = await Bun.file(
      "src/resources/storefront/catalog.json"
    ).json();
    return c.json(catalog);
  });
}
