import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "skip",
  aliases: ["s"],
  description: "Skip the current song",
  execute(message: Message) {
    bot.player.queues.cache.find((queue) => queue.guild.id === message.guild!.id)!.node.skip();

    message.reply("⏭️ Skipped the current song!");
  }
};
