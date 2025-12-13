import app from "../../..";
import crypto from "crypto";

export default function () {
  app.get("/fortnite/api/discovery/accessToken/*", async (c) => {
    const useragent: any = c.req.header("user-agent");
    if (!useragent) return c.json({ error: "Missing User-agent!" });

    const regex = useragent.match(/\+\+Fortnite\+Release-\d+\.\d+/);
    return c.json({
      branchName: regex[0],
      appId: "Fortnite",
      token: `${crypto.randomBytes(10).toString("hex")}=`,
    });
  });
}
