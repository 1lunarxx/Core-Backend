import { Schema, model } from "mongoose";

interface ITournament {
  accountId: string;
  hype: number;
  divisions: string[];
}

const TournamentSchema = new Schema<ITournament>({
  accountId: { type: String, required: true, unique: true },
  hype: { type: Number, required: true, default: 0 },
  divisions: { type: [String], required: true, default: ["NormalArenaDiv1"] },
});

const Tournaments = model<ITournament>("Tournaments", TournamentSchema);

export default Tournaments;
