interface ConfigSchema {
  port: number;
  maintenance: boolean;
  bot_token: string;
  log: boolean;
  sections: string;
  enable_shop: boolean;
  weekly: boolean;
  creators: string;
  connectionString: string;
}

export class Config {
  private config: Partial<ConfigSchema> = {};

  public async register() {
    this.config.port = Number(process.env.PORT ?? 443);
    this.config.connectionString =
      process.env.MONGO ?? "mongodb://localhost:27017/core";
    this.config.maintenance = (process.env.MAINTENANCE ?? "false") === "true";
    this.config.bot_token = process.env.BOT_TOKEN ?? "";
    this.config.log = (process.env.ENABLE_LOGGING ?? "true") === "true";
    this.config.sections = process.env.SECTIONS ?? "Core Bundle";
    this.config.enable_shop = (process.env.ENABLE_SHOP ?? "false") === "true";
    this.config.weekly = (process.env.WEEKLY ?? "false") === "true";
    this.config.creators = process.env.CREATORS ?? "";
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key] as ConfigSchema[T];
  }
}
