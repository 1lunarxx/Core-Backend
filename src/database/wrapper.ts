import mongoose from "mongoose";
import { LogDebug, LogError } from "../utils/handling/logging";

interface Config {
  connectionString?: string;
}

export class DataBase {
  constructor(private config: Config = {}) {}

  public async connect() {
    try {
      mongoose.connect(this.config.connectionString ?? "");
      LogDebug("Connected to the database!");
    } catch (er) {
      LogError("Couldnt connect to the database! " + er);
    }
  }
}
