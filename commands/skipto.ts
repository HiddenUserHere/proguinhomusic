import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "skipto",
  aliases: ["st"],
  description: i18n.__("skipto.description"),
  execute(message: Message, args: Array<any>) {
    bot.player.getQueue(message.guild!.id)!.skipTo(Number(args[0]));
  }
};
