import { Schema, model } from "mongoose";

interface IUser {
  accountId: string;
  email: string;
  password: string;
  username: string;
  banned: boolean;
  discordId: string;
  created: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  accountId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  banned: { type: Boolean, required: false, unique: false },
  created: { type: Date, required: false },
  discordId: { type: String, required: false, unique: true },
});

const User = model<IUser>("Users", UserSchema);

export default User;
