import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "skip",
  aliases: ["s"],
  description: "Skip the current song",
  execute(message: Message) {
    bot.player.getQueue(message.guild!.id)!.skip();

    message.reply("⏭️ Skipped the current song!");
  }
};
