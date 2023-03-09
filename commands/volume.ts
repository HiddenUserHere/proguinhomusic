import { Message } from "discord.js";
import { bot } from "../index";

export default {
  name: "volume",
  aliases: ["v"],
  description: "Change the volume of the music",
  execute(message: Message, args: Array<any>) {
    bot.player.getQueue(message.guild!.id)!.setVolume(Number(args[0]));
  }
};
