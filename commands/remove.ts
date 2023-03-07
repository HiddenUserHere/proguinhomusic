import { Message } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";

export default {
  name: "remove",
  aliases: ["rm"],
  description: i18n.__("remove.description"),
  execute(message: Message, args: any[])
  {
    bot.player.getQueue(message.guild!.id)!.remove(args[0]);
  }
};
