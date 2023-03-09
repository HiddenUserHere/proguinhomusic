import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "skipto",
  aliases: ["st"],
  description: "Skip to a specific song in the queue",
  execute(message: Message, args: Array<any>) {
    bot.player.getQueue(message.guild!.id)!.skipTo(Number(args[0]));
  }
};
