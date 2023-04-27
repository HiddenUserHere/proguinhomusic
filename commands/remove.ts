import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "remove",
  aliases: ["rm"],
  description: "Remove a song from the queue",
  execute(message: Message, args: any[])
  {
    bot.player.queues.cache.find((queue) => queue.guild.id === message.guild!.id)?.removeTrack(args[0] - 1);
  }
};
