import User from "../../../db/models/user.ts";
import app from "../../../index.ts";
import { v4 as uuidv4, v4 } from "uuid";
import { sign } from "hono/jwt";
import { accountIds } from "../account/public.ts";

export default function () {
  app.post("/account/api/oauth/token", async (c) => {
    const body = await c.req.parseBody();
    const user = await User.findOne({ email: body.username });
    const createId = v4();

    if (!body) {
      return c.json({ error: "Invalid request" }, 400);
    }

    if (user?.banned) return c.json({ error: "User is banned" }, 400);

    const now = new Date();
    const expires_in = Math.round((now.getTime() - now.getTime()) / 1000);
    const expires_at = new Date(now.getTime() + expires_in * 1000);

    let access;

    if (body.grant_type === "client_credentials") {
      access = await sign({ createId }, "Secret");
      return c.json({
        access_token: access,
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        token_type: "bearer",
        client_id: createId,
        internal_client: true,
        client_service: "fortnite",
      });
    } else if (body.grant_type === "password") {
      const { password } = body;

      if (
        !user?.password ||
        !(await Bun.password.verify(password as string, user.password))
      )
        return c.json({ error: "Invalid request" }, 400);

      let access = await sign(
        {
          email: body.username,
          password: body.password,
          type: "access",
        },
        "Secret"
      );

      let refresh = await sign(
        {
          email: body.username,
          password: body.password,
          type: "refresh",
        },
        "Secret"
      );

      return c.json({
        access_token: access,
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        token_type: "bearer",
        refresh_token: refresh,
        refresh_expires: 28800,
        refresh_expires_at: "9999-12-02T01:12:01.100Z",
        account_id: user?.accountId,
        client_id: createId,
        internal_client: true,
        client_service: "fortnite",
        displayName: user?.username,
        app: "fortnite",
        in_app_id: user?.accountId,
        device_id: createId,
      });
    } else if (body.grant_type === "refresh_token") {
      let access = await sign(
        {
          email: body.username,
          password: body.password,
          type: "access",
        },
        "Secret"
      );

      let refresh = await sign(
        {
          email: body.username,
          password: body.password,
          type: "refresh",
        },
        "Secret"
      );

      return c.json({
        access_token: access,
        expires_in: expires_in,
        expires_at: expires_at,
        token_type: "bearer",
        refresh_token: refresh,
        refresh_expires: 28800,
        refresh_expires_at: "9999-12-31T23:59:59.999Z",
        account_id: user?.accountId,
        client_id: createId,
        internal_client: true,
        client_service: "fortnite",
        displayName: user?.username,
        app: "fortnite",
        in_app_id: user?.accountId,
        device_id: createId,
      });
    } else if (body.grant_type === "exchange_code") {
      let access = await sign(
        {
          email: body.username,
          password: body.password,
          type: "access",
        },
        "Secret"
      );

      let refresh = await sign(
        {
          email: body.username,
          password: body.password,
          type: "refresh",
        },
        "Secret"
      );

      return c.json({
        access_token: access,
        expires_in: expires_in,
        expires_at: expires_at,
        token_type: "bearer",
        refresh_token: refresh,
        refresh_expires: 28800,
        refresh_expires_at: "9999-12-31T23:59:59.999Z",
        account_id: user?.accountId,
        client_id: createId,
        internal_client: true,
        client_service: "fortnite",
        displayName: user?.username,
        app: "fortnite",
        in_app_id: user?.accountId,
        device_id: createId,
      });
    }
  });

  app.post("/auth/v1/oauth/token", async (c) => {
    const body = await c.req.parseBody();
    return c.json({
      access_token: "eg1~Core",
      token_type: "bearer",
      expires_at: new Date(Date.now() + 3599 * 1000).toISOString(),
      nonce: body.nonce,
      features: [
        "AntiCheat",
        "Connect",
        "ContentService",
        "Ecom",
        "Inventories",
        "LockerService",
        "Matchmaking Service",
      ],
      organization_id: "Core",
      product_id: "prod-fn",
      sandbox_id: "fn",
      deployment_id: "62a9473a2dca46b29ccf17577fcf42d7",
      organization_user_id: "Core",
      product_user_id: "Core",
      product_user_id_created: false,
      id_token: "eg1~Core",
      expires_in: 3599,
    });
  });

  app.get("/epic/id/v2/sdk/accounts", async (c) => {
    const user = await User.findOne({ accountId: accountIds });
    if (!user) {
      return c.json({ error: "User not found or banned" }, 404);
    }

    return c.json([
      {
        accountId: accountIds,
        displayName: user.username,
        preferredLanguage: "en",
        linkedAccounts: [],
        cabinedMode: false,
        empty: false,
      },
    ]);
  });

  app.post("/epic/oauth/v2/token", async (c) => {
    const body = await c.req.parseBody();
    const { grant_type } = body;
    if (grant_type == "refresh_token") {
      const newToken = await sign(
        {
          account_id: accountIds,
        },
        "Secret"
      );

      return c.json({
        scope: body.scope,
        token_type: "bearer",
        access_token: newToken,
        refresh_token: newToken,
        id_token: newToken,
        expires_in: 115200,
        expires_at: new Date(Date.now() + 115200 * 1000).toISOString(),
        refresh_expires_in: 115200,
        refresh_expires_at: new Date(Date.now() + 115200 * 1000).toISOString(),
        account_id: accountIds,
        client_id: "ec684b8c687f479fadea3cb2ad83f5c6",
        application_id: "fghi4567FNFBKFz3E4TROb0bmPS8h1GW",
        selected_account_id: accountIds,
        merged_accounts: [],
      });
    }
  });
}
