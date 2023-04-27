import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "stop",
  description: "Stop the music and clear the queue",
  execute(message: Message) {
    bot.player.queues.cache.find((queue) => queue.guild.id === message.guild!.id)!.node.stop();
  }
};
