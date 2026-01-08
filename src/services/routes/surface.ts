import app from "../..";
import { v4 as uuidv4 } from "uuid";

export default function () {
  app.post("/api/v1/fortnite-br/surfaces/*/target", async (c) => {
    const Id = uuidv4();

    return c.json({
      contentType: "collection",
      contentId: "fortnite-br-br-motd-collection",
      tcId: Id,
      contentMeta: `"${Id}":[${Id}]}`,
      contentItems: [
        {
          contentType: "content-item",
          contentId: Id,
          tcId: Id,
          contentFields: {
            Buttons: [
              {
                Action: {
                  _type: "MotdDiscoveryAction",
                  category: "set_br_playlists",
                  islandCode: "set_br_playlists",
                  shouldOpen: true,
                },
                Style: "0",
                Text: "Play Now",
                _type: "Button",
              },
            ],
            FullScreenBackground: {
              Image: [
                {
                  width: 1920,
                  height: 1080,
                  url: "https://cdn1.epicgames.com/offer/fn/Blade_2560x1440_2560x1440-95718a8046a942675a0bc4d27560e2bb",
                },
                {
                  width: 960,
                  height: 540,
                  url: "https://cdn1.epicgames.com/offer/fn/Blade_2560x1440_2560x1440-95718a8046a942675a0bc4d27560e2bb",
                },
              ],
              _type: "FullScreenBackground",
            },
            FullScreenBody: "Core Backend",
            FullScreenTitle: "Core",
            TeaserBackground: {
              Image: [
                {
                  width: 1024,
                  height: 512,
                  url: "https://cdn1.epicgames.com/offer/fn/Blade_2560x1440_2560x1440-95718a8046a942675a0bc4d27560e2bb",
                },
              ],
              _type: "TeaserBackground",
            },
            TeaserTitle: "Core",
            VerticalTextLayout: false,
          },
          contentSchemaName: "DynamicMotd",
          contentHash: "c93adbc7a8a9f94a916de62aa443e2d6",
        },
      ],
    });
  });

  app.post("/api/v2/discovery/surface/*", async (c) => {
    return c.json({
      panels: [
        {
          panelName: "Homebar_V3",
          panelDisplayName: "Test_EpicsPicksHomebar",
          featureTags: ["col:5", "homebar"],
          firstPage: {
            results: [
              {
                lastVisited: null,
                linkCode: "reference_byepicnocompetitive_5",
                isFavorite: false,
                globalCCU: 1,
              },
            ],
            hasMore: false,
            panelTargetName: null,
          },
          panelType: "CuratedList",
          playHistoryType: null,
        },
        {
          panelName: "ByEpicNoCompetitive",
          panelDisplayName: "By Epic",
          featureTags: ["col:5"],
          firstPage: {
            results: [
              {
                lastVisited: null,
                linkCode: "set_br_playlists",
                isFavorite: false,
                globalCCU: 1,
              },
              {
                lastVisited: null,
                linkCode: "playlist_durian",
                isFavorite: false,
                globalCCU: 1,
              },
              {
                lastVisited: null,
                linkCode: "playlist_papaya",
                isFavorite: false,
                globalCCU: 1,
              },
              {
                lastVisited: null,
                linkCode: "playlist_juno",
                isFavorite: false,
                globalCCU: 1,
              },
            ],
            hasMore: true,
            panelTargetName: null,
          },
          panelType: "AnalyticsList",
          playHistoryType: null,
        },
      ],
    });
  });

  app.post("/fortnite/api/game/v2/creative/discovery/surface/*", async (c) => {
    const menu = await Bun.file("src/resources/discovery/menu.json").json();

    return c.json(menu);
  });

  app.post("/api/v1/discovery/surface/*", async (c) => {
    const menu = await Bun.file("src/resources/discovery/menu.json").json();

    return c.json(menu);
  });
}
