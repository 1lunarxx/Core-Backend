import { Document, Schema, model } from "mongoose";

export interface IToken extends Document {
  AccountId: string;
  Token: string;
  Type: string;
}

const TokenSchema: Schema<IToken> = new Schema(
  {
    AccountId: { type: String, required: true, unique: false },
    Token: { type: String, required: true, unique: false },
    Type: { type: String, required: true, unique: false },
  },
  {
    collection: "tokens",
  }
);

const Token = model<IToken>("Tokens", TokenSchema);
export default Token;
