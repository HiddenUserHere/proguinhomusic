import "dotenv/config";
import { Config } from "../interfaces/Config";

let config: Config;

try {
  config = require("../config.json");
} catch (error) {
  config = {
    TOKEN: process.env.TOKEN || "",
    PREFIX: process.env.PREFIX || "!",
    MAX_PLAYLIST_SIZE: parseInt(process.env.MAX_PLAYLIST_SIZE!) || 10,
    PRUNING: process.env.PRUNING === "true" ? true : false,
    STAY_TIME: parseInt(process.env.STAY_TIME!) || 30,
    DEFAULT_VOLUME: parseInt(process.env.DEFAULT_VOLUME!) || 100,
    LOCALE: process.env.LOCALE || "en",
    BUTTONS: process.env.BUTTONS === "true" ? true : false,
    HOST_IP: process.env.HOST_IP || "localhost",
    HOST_PORT: parseInt(process.env.HOST_PORT!) || 3000,
    OPENAI_EMAIL: process.env.OPENAI_EMAIL || "",
    OPENAI_PASSWORD: process.env.OPENAI_PASSWORD || "",
    OPENAI_ACCESS_TOKEN: process.env.OPENAI_ACCESS_TOKEN || "",
    DEBUG: process.env.DEBUG === "true" ? true : false,
  };
}

export { config };
