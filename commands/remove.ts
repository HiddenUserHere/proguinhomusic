import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "remove",
  aliases: ["rm"],
  description: "Remove a song from the queue",
  execute(message: Message, args: any[])
  {
    bot.player.getQueue(message.guild!.id)!.remove(args[0]);
  }
};
