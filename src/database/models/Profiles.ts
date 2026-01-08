import { Schema, model } from "mongoose";

interface IProfile {
  profiles: Record<string, any>;
  accountId: string;
}

const ProfileSchema = new Schema<IProfile>({
  accountId: { type: String, required: true, unique: true },
  profiles: { type: Schema.Types.Mixed, required: true },
});

const Profiles = model<IProfile>("Profiles", ProfileSchema);

export default Profiles;
