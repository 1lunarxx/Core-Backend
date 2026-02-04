import app, { config } from "../..";

export default function () {
  app.get("/lightswitch/api/service/bulk/status", async (c) => {
    const isMaintenance = config.get("maintenance");

    return c.json([
      {
        serviceInstanceId: "fortnite",
        status: isMaintenance ? "DOWN" : "UP",
        message: isMaintenance ? "Fortnite is offline" : "Fortnite is online",
        maintenanceUri: null,
        overrideCatalogIds: ["a7f138b2e51945ffbfdacc1af0541053"],
        allowedActions: ["PLAY", "DOWNLOAD"],
        banned: false,
        launcherInfoDTO: {
          appName: "Fortnite",
          catalogItemId: "4fe75bbc5a674f4f9b356b5c90567da5",
          namespace: "fn",
        },
      },
    ]);
  });
}
