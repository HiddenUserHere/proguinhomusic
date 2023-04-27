import { QueryType } from "discord-player";
import { Message, PermissionFlagsBits } from "discord.js";
import { bot } from "../index";

export default {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Play a music",
  permissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.AddReactions, PermissionFlagsBits.ManageMessages],
  async execute(message: Message, args: string[])
  {
    try{
    const guild = message.guild!;

    //Get all after the command
    const query = args.join(' ');


      await bot.player.play(message.member!.voice!.channel!, query, {
        searchEngine: QueryType.YOUTUBE,
        nodeOptions: {
          // nodeOptions are the options for guild node (aka your queue in simple word)
          metadata: {
            channel: message.channel,
            message: message,
            requestedBy: message.author
          }
        }
      });

    } catch (err)
    {
      console.log(err);
    }
  }
};
