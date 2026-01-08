import { sign } from "hono/jwt";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";
import app from "../..";
import User from "../../database/models/User";

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

  app.get("/account/api/oauth/verify", async (c) => {
    let token = c.req.header("authorization")?.replace("bearer ", "");

    return c.json({
      token: token,
      account_id: c.req.param("accountId"),
      client_id: v4(),
      internal_client: true,
      client_service: "fortnite",
      expires_in: 28800,
      expires_at: "9999-12-02T01:12:01.100Z",
      app: "fortnite",
      auth_method: "password",
      device_id: v4(),
      displayName: c.req.param("username"),
      in_app_id: c.req.param("accountId"),
    });
  });

  app.post("/auth/v1/oauth/token", async (c) => {
    const body = await c.req.parseBody();
    const { deployment_id } = body;

    let access_token = await sign(
      {
        clientId: v4(),
        role: "GameClient",
        productId: "prod-fn",
        iss: "eos",
        env: "prod",
        nonce: "NUBjE_gKkk2Xvhdr54YOCA",
        organizationId: "o-aa83a0a9bc45e98c80c1b1c9d92e9e",
        features: [
          "AntiCheat",
          "CommerceService",
          "Connect",
          "ContentService",
          "Ecom",
          "EpicConnect",
          "Inventories",
          "LockerService",
          "MagpieService",
          "MatchmakingService",
          "PCBService",
          "QuestService",
          "Stats",
        ],
        productUserId: "00021c6e5a3e42cdbbdf174562fd6afc",
        organizationUserId: "0001103f1a9b43b1a5a3defb29deaffb",
        clientIp: "127.0.0.1",
        deploymentId: deployment_id,
        sandboxId: "fn",
        tokenType: "userToken",
        exp: 1966580379,
        iat: 1966576779,
        jti: "589e0b0ee6d3444981eac054ac1425a2",
      },
      v4()
    );

    let id_token = await sign(
      {
        aud: v4(),
        sub: v4(),
        pfsid: "fn",
        pfdid: v4(),
        iss: "http://127.0.0.1:443/auth/v1/oauth",
        exp: 1966580379,
        tokenType: "idToken",
        iat: 1966576779,
        pfpid: "prod-fn",
      },
      v4()
    );

    return c.json({
      access_token: access_token,
      token_type: "bearer",
      expires_at: "9999-12-27T12:46:19.086Z",
      nonce: body.nonce,
      features: [
        "AntiCheat",
        "CommerceService",
        "MatchmakingService",
        "Connect",
        "ContentService",
        "Ecom",
        "EpicConnect",
        "Inventories",
        "LockerService",
        "MagpieService",
        "PCBService",
        "QuestService",
        "Stats",
      ],
      organization_id: "o-aa83a0a9bc45e98c80c1b1c9d92e9e",
      product_id: "prod-fn",
      sandbox_id: "fn",
      deployment_id: "62a9473a2dca46b29ccf17577fcf42d7",
      organization_user_id: "0001103f1a9b43b1a5a3defb29deaffb",
      product_user_id: "00021c6e5a3e42cdbbdf174562fd6afc",
      product_user_id_created: false,
      id_token: id_token,
      expires_in: 28800,
    });
  });

  app.post("/epic/oauth/v2/token", async (c) => {
    const body = await c.req.parseBody();
    const { refresh_token, scope }: any = body;

    const token: any = jwt.decode(refresh_token.split("eg1~")[1]);
    const user = await User.findOne({ username: token?.dn });
    if (!user) return c.json({});

    let access = await sign(
      {
        email: user.email,
        password: user.password,
        type: "access",
      },
      process.env.JWT_SECRET as string
    );

    return c.json({
      scope: scope,
      token_type: "bearer",
      access_token: access,
      expires_in: 28800,
      expires_at: "9999-12-31T23:59:59.999Z",
      refresh_token: refresh_token,
      refresh_expires_in: 86400,
      refresh_expires_at: "9999-12-31T23:59:59.999Z",
      account_id: user.accountId,
      client_id: v4(),
      application_id: v4(),
      selected_account_id: user.accountId,
      id_token: v4(),
    });
  });

  app.post("/epic/oauth/v2/revoke", async (c) => {
    return c.body(null, 204);
  });

  app.delete("/account/api/oauth/sessions/kill", async (c) => {
    c.status(204);
    return c.json({});
  });
}
