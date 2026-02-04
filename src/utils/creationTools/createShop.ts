import type { CatalogEntry } from "../types/catalog";
import { Log } from "../logging";
const shop = Bun.file("config/shop_config.json");
const config = await shop.json();

const file = await Bun.file("src/resources/storefront/catalog.json").json();
const catalog = Array.isArray(file.storefronts) ? file.storefronts : [];

// poop code
type itemtypes =
  | "AthenaCharacter"
  | "AthenaPickaxe"
  | "AthenaDance"
  | "AthenaGlider";

const itemPrefixThingy = {
  SKIN: "AthenaCharacter",
  PICKAXE: "AthenaPickaxe",
  DANCE: "AthenaDance",
  GLIDER: "AthenaGlider",
} as const;

function createEntry(
  id: string,
  type: itemtypes,
  price: number,
  sectionId: "Featured" | "Daily",
): CatalogEntry {
  const layout = sectionId === "Featured" ? "Core" : "Daily";
  const analyticId = sectionId === "Featured" ? "Core" : "DailyCore";

  return {
    devName: `${type}:${id}`,
    offerId: `${type}:${id}`,
    fulfillmentIds: [],
    dailyLimit: -1,
    weeklyLimit: -1,
    monthlyLimit: -1,
    categories: [],
    prices: [
      {
        currencyType: "MtxCurrency",
        currencySubType: "",
        regularPrice: price,
        finalPrice: price,
        saleExpiration: "9999-12-02T01:12:00Z",
        basePrice: price,
      },
    ],
    meta: {
      NewDisplayAssetPath: "",
      SectionId: sectionId,
      LayoutId: layout,
      TileSize: "Normal",
      AnalyticOfferGroupId: analyticId,
      FirstSeen: "2/2/2020",
    },
    matchFilter: "",
    filterWeight: 0,
    appStoreId: [],
    requirements: [
      {
        requirementType: "DenyOnItemOwnership",
        requiredId: `${type}:${id}`,
        minQuantity: 1,
      },
    ],
    offerType: "StaticPrice",
    giftInfo: {
      bIsEnabled: true,
      forcedGiftBoxTemplateId: "",
      purchaseRequirements: [],
      giftRecordIds: [],
    },
    refundable: true,
    metaInfo: [
      { key: "NewDisplayAssetPath", value: "=" },
      { key: "SectionId", value: sectionId },
      { key: "LayoutId", value: layout },
      { key: "TileSize", value: "Normal" },
      { key: "AnalyticOfferGroupId", value: analyticId },
      { key: "FirstSeen", value: "2/2/2020" },
    ],
    displayAssetPath: `/Game/Catalog/DisplayAssets/DA_Featured_${id}.DA_Featured_${id}`,
    itemGrants: [{ templateId: `${type}:${id}`, quantity: 1 }],
    sortPriority: 0,
    catalogGroupPriority: 0,
  };
}

function* createEntries(): Generator<{
  id: string;
  type: itemtypes;
  price: number;
}> {
  const pattern = /^([A-Z]+)(\d*)$/;

  for (const key in config) {
    const match = key.match(pattern);
    if (!match) continue;

    const [_, prefix, number] = match;
    const id = config[key];
    const type = itemPrefixThingy[prefix as keyof typeof itemPrefixThingy];
    if (!type) continue;

    const priceKey = `${prefix}${number}_PRICE`;
    const price = typeof config[priceKey] === "number" ? config[priceKey] : 0;

    yield { id, type, price };
  }
}

export function createCatalog() {
  const entries = Array.from(createEntries());

  const weekly = entries
    .slice(0, 5)
    .map((e) => createEntry(e.id, e.type, e.price, "Featured"));

  const daily = entries
    .slice(5, 12)
    .map((e) => createEntry(e.id, e.type, e.price, "Daily"));

  const returningCatalog = [
    {
      name: "BRWeeklyStorefront",
      catalogEntries: weekly,
    },
    {
      name: "BRDailyStorefront",
      catalogEntries: daily,
    },
    ...catalog.filter(
      (s: any) =>
        s.name !== "BRWeeklyStorefront" && s.name !== "BRDailyStorefront",
    ),
  ];

  return {
    refreshIntervalHrs: 24,
    dailyPurchaseHrs: 24,
    expiration: "9999-12-31T00:00:00.000Z",
    storefronts: returningCatalog,
  };
}
