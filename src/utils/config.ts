interface ConfigSchema {
  port: number;
  mmport: number;
  maintenance: boolean;
  bot_token: string;
  log: boolean;
  sections: string;
  enable_shop: boolean;
  weekly: boolean;
  gameserverIp: string;
  gameserverPort: number;
  creators: string;
  connectionString: string;
}

export class Config {
  private config: Partial<ConfigSchema> = {};

  public async register() {
    this.config.port = Number(process.env.PORT ?? 443);
    this.config.mmport = Number(process.env.MMPORT ?? 80);
    this.config.connectionString =
      process.env.MONGO ?? "mongodb://localhost:27017/core";
    this.config.maintenance = (process.env.MAINTENANCE ?? "false") === "true";
    this.config.bot_token = process.env.BOT_TOKEN ?? "";
    this.config.log = (process.env.LOG ?? "true") === "true";
    this.config.sections = process.env.SECTIONS ?? "Core Bundle";
    this.config.enable_shop = (process.env.ENABLE_SHOP ?? "false") === "true";
    this.config.weekly = (process.env.WEEKLY ?? "false") === "true";
    this.config.gameserverIp = process.env.GameserverIP ?? "127.0.0.1";
    this.config.gameserverPort = Number(process.env.GameserverPort ?? 7777);
    this.config.creators = process.env.CREATORS ?? "";
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key] as ConfigSchema[T];
  }
}
