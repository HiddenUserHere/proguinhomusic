import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "stop",
  description: "Stop the music and clear the queue",
  execute(message: Message) {
    bot.player.getQueue(message.guild!.id)!.stop();
  }
};
