import { Message } from "discord.js";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";

export default {
  name: "volume",
  aliases: ["v"],
  description: i18n.__("volume.description"),
  execute(message: Message, args: Array<any>) {
    bot.player.getQueue(message.guild!.id)!.setVolume(Number(args[0]));
  }
};
