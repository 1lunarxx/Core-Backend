import app from "../..";
import path from "path";
import fs from "fs";

export default function () {
  app.post("/links/api/fn/mnemonic", async (c) => {
    let response = [];

    const discovery = await JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../resources/discovery/discovery.json"),
        "utf-8"
      )
    );

    for (var i in discovery.Panels[1].Pages[0].results) {
      response.push(discovery.Panels[1].Pages[0].results[i].linkData);
    }

    return c.json(response);
  });

  app.get("/links/api/fn/mnemonic/:playlist", async (c) => {
    const discovery = await JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../resources/discovery/discovery.json"),
        "utf-8"
      )
    );

    for (const result of discovery.Panels[1].Pages[0].results) {
      if (result.linkData.mnemonic == c.req.param("playlist")) {
        return c.json(result);
      }
    }

    return c.json({});
  });

  app.get("/links/api/fn/mnemonic/:playlistId/related", async (c) => {
    const playlistId = c.req.param("playlistId");

    return c.json({
      parentLinks: [],
      links: {
        [playlistId ?? "Playlist_DefaultSolo"]: {
          namespace: "fn",
          accountId: "epic",
          creatorName: "Epic",
          mnemonic: playlistId,
          linkType: "BR:Playlist",
          metadata: {
            image_url: "",
            image_urls: {
              url_s: "",
              url_xs: "",
              url_m: "",
              url: "",
            },
            locale: "en",
            title: "Solo",
            alt_title: {
              en: "Solo",
            },
            alt_tagline: {
              en: "",
            },
            matchmaking: {
              override_playlist: playlistId,
            },
          },
          version: 95,
          active: true,
          disabled: false,
          created: new Date().toISOString(),
          published: new Date().toISOString(),
          descriptionTags: [],
          moderationStatus: "Approved",
        },
      },
    });
  });
}
