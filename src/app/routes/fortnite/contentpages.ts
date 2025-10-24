import app from "../../..";
import { createSection } from "../../../utils/creationTools/createSection";
import { getVersion } from "../../../utils/handling/getVersion";

export default function () {
  app.get("/content/api/pages/fortnite-game", async (c) => {
    const ver = await getVersion(c);
    if (!ver) return c.json({ error: "Incorrect HTTP Method" });
    const section = await createSection();

    const content = {
      _title: "Fortnite Game",
      _activeDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      _locale: "en-US",
      tournamentinformation: {
        _activeDate: new Date().toISOString(),
        _locale: "en-US",
        _templateName: "FortniteGameTournamentInfo",
        _title: "tournamentinformation",
        conversion_config: {
          _type: "Conversion Config",
          containerName: "tournament_info",
          contentName: "tournaments",
          enableReferences: true,
        },
        lastModified: "0001-01-01T00:00:00",
        tournament_info: {
          _type: "Tournaments Info",
          tournaments: [
            {
              _type: "Tournament Display Info",
              loading_screen_image:
                "https://cdn.projecthelix.website/Arena_Playlist.png",
              playlist_tile_image:
                "https://cdn.projecthelix.website/Arena_Playlist.png",
              title_line_1: "LATEGAME ARENA",
              title_line_2: null,
              tournament_display_id: "ARENA_SOLO",
            },
            {
              loading_screen_image: "",
              poster_back_image:
                "https://cdn2.unrealengine.com/Fortnite/fortnite-game/tournaments/AlphaTournament_Solo_Back-750x1080-994abaad723dd8bd579d6c4518d5a44c9fcebc85.jpg",
              _type: "Tournament Display Info",
              pin_earned_text: "",
              tournament_display_id: "corelg",
              background_text_color: "04208F",
              poster_fade_color: "000F4A",
              secondary_color: "000F4A",
              title_color: "FFFFFF",
              background_right_color: "00F0FF",
              highlight_color: "F7FF00",
              primary_color: "FFFFFF",
              shadow_color: "04208F",
              background_left_color: "124AEC",
              base_color: "FFFFFF",
              schedule_info: "June 8, 2025",
              flavor_description: "Get Top 5 To Earn Prizes!",
              poster_front_image:
                "https://cdn2.unrealengine.com/Fortnite/fortnite-game/tournaments/AlphaTournament_Solo2_Front-750x1080-681e9a01f2634c711543b36cd30245b1b0846f7c.jpg",
              short_format_title: "",
              title_line_2: "Lategame Cash Cup",
              title_line_1: "Core",
              details_description: "Core Tournament",
              long_format_title: "",
            },
          ],
        },
      },
      playlistinformation: {
        frontend_matchmaking_header_style: "None",
        _title: "playlistinformation",
        frontend_matchmaking_header_text: "",
        playlist_info: {
          _type: "Playlist Information",
          playlists: [
            {
              image: ``,
              playlist_name: "Playlist_DefaultSolo",
              hidden: false,
              special_border: "None",
              _type: "FortPlaylistInfo",
            },
            {
              image:
                "https://cdn2.unrealengine.com/Fortnite/fortnite-game/playlistinformation/CM_LobbyTileArt-1024x512-fbcd48db36552ccb1ab4021b722ea29d515377cc.jpg",
              playlist_name: "Playlist_PlaygroundV2",
              hidden: false,
              special_border: "None",
              _type: "FortPlaylistInfo",
            },
            {
              image: ``,
              playlist_name: "Playlist_DefaultDuo",
              hidden: false,
              special_border: "None",
              _type: "FortPlaylistInfo",
            },
            {
              image: ``,
              playlist_name: "Playlist_DefaultSquad",
              hidden: false,
              special_border: "None",
              _type: "FortPlaylistInfo",
            },
          ],
        },
        _noIndex: false,
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      playlistimages: {
        playlistimages: {
          images: [
            {
              image: ``,
              _type: "PlaylistImageEntry",
              playlistname: "Playlist_DefaultSolo",
            },
            {
              image:
                "https://cdn2.unrealengine.com/Fortnite/fortnite-game/playlistinformation/CM_LobbyTileArt-1024x512-fbcd48db36552ccb1ab4021b722ea29d515377cc.jpg",
              playlistname: "Playlist_PlaygroundV2",
              _type: "PlaylistImageEntry",
            },
            {
              image: ``,
              _type: "PlaylistImageEntry",
              playlistname: "Playlist_DefaultDuo",
            },
            {
              image: ``,
              _type: "PlaylistImageEntry",
              playlistname: "Playlist_DefaultSquad",
            },
          ],
          _type: "PlaylistImageList",
        },
        _title: "playlistimages",
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      emergencynotice: {
        news: {
          _type: "Battle Royale News",
          messages: [
            {
              // hidden: false,
              // _type: "CommonUI Simple Message Base",
              // title: "Core",
              // body: "Welcome to Core Backend! Made by Lunar, Github: https://github.com/lunarissigma/Core-Backend",
              // spotlight: true,
            },
          ],
        },
        _title: "emergencynotice",
        _noIndex: false,
        alwaysShow: false,
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      emergencynoticev2: {
        "jcr:isCheckedOut": true,
        _title: "emergencynoticev2",
        _noIndex: false,
        emergencynotices: {
          _type: "Emergency Notices",
          emergencynotices: [
            {
              gamemodes: [],
              hidden: false,
              _type: "CommonUI Emergency Notice Base",
              title: "Core",
              body: "Welcome to Core Backend! Made by Lunar, Github: https://github.com/lunarissigma/Core-Backend",
            },
          ],
        },
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      lobby: {
        stage: `season${ver.build}`,
        _title: "lobby",
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      // fucked system
      dynamicbackgrounds:
        ver.build === 28
          ? {
              backgrounds: {
                backgrounds: [
                  {
                    stage: `defaultnotris`,
                    _type: "DynamicBackground",
                    backgroundimage:
                      "https://cdn2.unrealengine.com/ch5s1-lobbybg-3640x2048-0974e0c3333c.jpg",
                    key: "lobby",
                  },
                ],
                _type: "DynamicBackgroundList",
              },
              _title: "dynamicbackgrounds",
              _noIndex: false,
              _activeDate: "2019-08-21T15:59:59.342Z",
              lastModified: "2019-10-29T13:07:27.936Z",
              _locale: "en-US",
              _templateName: "FortniteGameDynamicBackgrounds",
            }
          : ver.build === 24
          ? {
              backgrounds: {
                backgrounds: [
                  {
                    stage: `defaultnotris`,
                    _type: "DynamicBackground",
                    backgroundimage:
                      "https://cdn2.unrealengine.com/t-ch4s2-bp-lobby-4096x2048-edde08d15f7e.jpg",
                    key: "lobby",
                  },
                ],
                _type: "DynamicBackgroundList",
              },
              _title: "dynamicbackgrounds",
              _noIndex: false,
              _activeDate: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              _locale: "en-US",
              _templateName: "FortniteGameDynamicBackgrounds",
            }
          : ver.build === 20
          ? {
              backgrounds: {
                backgrounds: [
                  {
                    stage: `season20`,
                    _type: "DynamicBackground",
                    backgroundimage:
                      "https://cdn2.unrealengine.com/t-bp20-40-armadillo-glowup-lobby-2048x2048-2048x2048-3b83b887cc7f.jpg",
                    key: "lobby",
                  },
                ],
                _type: "DynamicBackgroundList",
              },
              _title: "dynamicbackgrounds",
              _noIndex: false,
              _activeDate: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              _locale: "en-US",
              _templateName: "FortniteGameDynamicBackgrounds",
            }
          : ver.build === 23
          ? {
              backgrounds: {
                backgrounds: [
                  {
                    stage: `season2300`,
                    _type: "DynamicBackground",
                    backgroundimage:
                      "https://cdn2.unrealengine.com/t-bp23-lobby-2048x1024-2048x1024-26f2c1b27f63.png",
                    key: "lobby",
                  },
                ],
                _type: "DynamicBackgroundList",
              },
              _title: "dynamicbackgrounds",
              _noIndex: false,
              _activeDate: "2019-08-21T15:59:59.342Z",
              lastModified: "2019-10-29T13:07:27.936Z",
              _locale: "en-US",
              _templateName: "FortniteGameDynamicBackgrounds",
            }
          : {
              backgrounds: {
                backgrounds: [
                  {
                    stage: `season${ver.build}`,
                    _type: "DynamicBackground",
                    key: "lobby",
                  },
                ],
                _type: "DynamicBackgroundList",
              },
              _title: "dynamicbackgrounds",
              _noIndex: false,
              _activeDate: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              _locale: "en-US",
              _templateName: "FortniteGameDynamicBackgrounds",
            },

      ...section,
      _suggestedPrefetch: [],
    };

    return c.json(content);
  });
}
