import { config } from "../..";

export async function createSection() {
  // proper ig
  const mainSections = [
    {
      bSortOffersByOwnership: false,
      bShowIneligibleOffersIfGiftable: false,
      bEnableToastNotification: true,
      background: {
        stage: "default",
        _type: "DynamicBackground",
        key: "vault",
      },
      _type: "ShopSection",
      landingPriority: 70,
      bHidden: false,
      sectionId: "Featured",
      bShowTimer: true,
      sectionDisplayName: "Featured",
      bShowIneligibleOffers: true,
    },
    {
      bSortOffersByOwnership: false,
      bShowIneligibleOffersIfGiftable: false,
      bEnableToastNotification: true,
      background: {
        stage: "default",
        _type: "DynamicBackground",
        key: "vault",
      },
      _type: "ShopSection",
      landingPriority: 70,
      bHidden: false,
      sectionId: "Daily",
      bShowTimer: false,
      sectionDisplayName: "Daily",
      bShowIneligibleOffers: true,
    },
  ];

  const addedSections =
    config
      .get("sections")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];

  for (const section of addedSections) {
    mainSections.push({
      bSortOffersByOwnership: false,
      bShowIneligibleOffersIfGiftable: false,
      bEnableToastNotification: true,
      background: {
        stage: "default",
        _type: "DynamicBackground",
        key: "vault",
      },
      _type: "ShopSection",
      landingPriority: 70,
      bHidden: false,
      sectionId: section,
      bShowTimer: false,
      sectionDisplayName: section,
      bShowIneligibleOffers: true,
    });
  }

  return {
    shopSections: {
      _title: "shop-sections",
      sectionList: {
        _type: "ShopSectionList",
        sections: mainSections,
      },
      _noIndex: false,
      _activeDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      _locale: "en-US",
      _templateName: "FortniteGameShopSections",
    },
  };
}
