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

      let queue = bot.player.getQueue(message.guild!.id)!;
      
      if (queue === undefined)
      {
        queue = await bot.player.createQueue(guild, {
          leaveOnEndCooldown: 1000 * 60 * 2,
          leaveOnEmptyCooldown: 1000 * 60 * 2,
          ytdlOptions: {
            quality: 'highest',
            filter: 'audioonly',
            highWaterMark: 1 << 25,
            dlChunkSize: 0
          },
          metadata: {
            channel: message.channel,
            message: message
          }
        });
      }

    //Get all after the command
    const query = args.join(' ');

    
    const searchResult = await bot.player
      .search(query, {
        requestedBy: message.author,
        searchEngine: QueryType.AUTO
      })
      .catch(() =>
      {
        console.log('he');
      });
    if (!searchResult || !searchResult.tracks.length) return message.reply('No results were found!');
    
      const member = message.author;
      try
      {
        if (!queue.connection) await queue.connect(message.member!.voice!.channel!);
      } catch {
        void bot.player.deleteQueue(guild.id);
        message.reply('❌ | Could not join your voice channel!');

        return;
      }

      message.reply(`⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`);
      
      queue.metadata = {
        channel: message.channel,
        message: message
      };
      
      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (err)
    {
      console.log(err);
    }
  }
};
