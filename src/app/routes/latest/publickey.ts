import { v4 } from "uuid";
import app from "../../..";

export default function () {
  app.post("/publickey/v2/publickey", async (c) => {
    const body = await c.req.parseBody();

    return c.json({
      key: body.key,
      account_id: c.req.query("accountId"),
      key_guid: v4(),
      kid: "20230621",
      expiration: "9999-12-31T23:59:59.999Z",
      jwt: "Core",
      type: "legacy",
    });
  });
}
