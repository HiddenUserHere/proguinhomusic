import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";
import { Message } from "discord.js";

export default {
  name: "pause",
  description: 'Pause the currently playing music.',
  execute(message: Message)
  {
    bot.player.getQueue(message.guild!.id)!.setPaused(true);

    message.reply('Paused the music for you!');
  }
};
