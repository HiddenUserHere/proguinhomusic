import { Message } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";

export default {
  name: "resume",
  aliases: ["r"],
  description: i18n.__("resume.description"),
  execute(message: Message)
  {
    bot.player.getQueue(message.guild!.id)!.setPaused(false);

    message.reply('Resumed the music for you!');
  }
};
