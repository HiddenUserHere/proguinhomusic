import { Message } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";

export default {
  name: "stop",
  description: i18n.__("stop.description"),
  execute(message: Message) {
    bot.player.getQueue(message.guild!.id)!.stop();
  }
};
