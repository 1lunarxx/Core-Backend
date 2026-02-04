import { decode, sign } from "jsonwebtoken";
import Token from "../../database/models/Tokens";
import { v4 } from "uuid";
import type { Context } from "hono";
import User from "../../database/models/User";

export enum ETokenType {
  Access = "access",
  Refresh = "refresh",
}

export interface TokenPayload {
  app: string;
  sub: string;
  dvid: number;
  mver: boolean;
  clid: string;
  dn: string;
  am: string;
  p: string;
  iai: string;
  sec: number;
  clsvc: string;
  t: string;
  ic: boolean;
  jti: string;
  creation_date: string;
  expires_in: number;
}

export default class TokenManager {
  static async createToken(
    clientId: string,
    grantType: string,
    user: any,
    tokenType: ETokenType
  ) {
    const expiresIn = 28800;

    const payload: TokenPayload = {
      app: "fortnite",
      sub: user.accountId,
      dvid: Math.floor(Math.random() * 1e9),
      mver: false,
      clid: clientId,
      dn: user.username,
      am: tokenType === ETokenType.Access ? grantType : "refresh",
      p: Buffer.from(v4()).toString("base64"),
      iai: user.accountId,
      sec: 1,
      clsvc: "fortnite",
      t: "s",
      ic: true,
      jti: v4(),
      creation_date: new Date().toISOString(),
      expires_in: expiresIn,
    };

    const jwtToken = sign(payload, "Secret", {
      expiresIn,
    });

    await Token.create({
      AccountId: user.accountId,
      Type: `${tokenType}token`,
      Token: jwtToken,
    });

    return jwtToken;
  }

  static async verifyToken(c: Context): Promise<boolean> {
    const authorization = c.req.header("Authorization");
    if (!authorization) return false;

    let token = authorization.trim();

    if (token.startsWith("Bearer ")) {
      token = token.slice("Bearer ".length);
    }

    if (token.startsWith("eg1~")) {
      token = token.slice("eg1~".length);
    }

    let accountId: string;

    try {
      const decodedToken: any = await decode(token);
      if (!decodedToken) return false;

      accountId = decodedToken.sub;
      if (!accountId) return false;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return false;
    }

    try {
      const user = await User.findOne({ accountId: accountId });

      if (!user) return false;
      if (user.banned) return false;

      return true;
    } catch (ex) {
      console.error("Error verifying token:", ex);
      return false;
    }
  }
}
