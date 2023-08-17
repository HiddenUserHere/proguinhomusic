import { QueryType } from "discord-player";
import { Message, PermissionFlagsBits } from "discord.js";
import { bot } from "../index";
import { SearchQueryType } from "discord-player";
import { config } from "../utils/config";

export default {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Play a music",
  permissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.AddReactions, PermissionFlagsBits.ManageMessages],
  async execute(message: Message, args: string[])
  {
    try{
    //Get all after the command
      const query = args.join(' ');
      
      let searchEngine: SearchQueryType = QueryType.YOUTUBE;
      if (query.includes("spotify.com"))
      {
        searchEngine = QueryType.SPOTIFY_SONG;
        if(query.includes("/playlist"))
        {
          searchEngine = QueryType.SPOTIFY_PLAYLIST;
        }
      }
      else if (query.includes("soundcloud.com"))
      {
        searchEngine = QueryType.SOUNDCLOUD_SEARCH;
      }
      


      await bot.player.play(message.member!.voice!.channel!, query, {
        searchEngine: searchEngine,
        nodeOptions: {
          leaveOnEmptyCooldown: config.STAY_TIME * 1000,
          leaveOnEmpty: true,
          leaveOnEnd: false,
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
