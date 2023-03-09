import { Message } from "discord.js";
import { bot } from "../index";
export default {
  name: "resume",
  aliases: ["r"],
  description: "Resume the currently paused music.",
  execute(message: Message)
  {
    bot.player.getQueue(message.guild!.id)!.setPaused(false);

    message.reply('Resumed the music for you!');
  }
};
