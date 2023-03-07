import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "skip",
  aliases: ["s"],
  description: i18n.__("skip.description"),
  execute(message: Message) {
    bot.player.getQueue(message.guild!.id)!.skip();

    message.reply("⏭️ Skipped the current song!");
  }
};
