import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "shuffle",
  description: i18n.__("shuffle.description"),
  execute(message: Message) {
    bot.player.getQueue(message.guild!.id)!.shuffle();
  }
};
