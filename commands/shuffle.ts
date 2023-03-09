import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "shuffle",
  description: "Shuffle the queue",
  execute(message: Message) {
    bot.player.getQueue(message.guild!.id)!.shuffle();
  }
};
