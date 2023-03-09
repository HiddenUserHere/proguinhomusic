import { Message, EmbedBuilder, Embed, EmbedType } from "discord.js";
import { bot } from "../index";
import { Queue } from "discord-player";

function zeroPad(nr: number, base: number)
{
  var len = (String(base).length - String(nr).length) + 1;
  return len > 0 ? new Array(len).join('0') + nr : nr;
}

export default {
  name: "np",
  cooldown: 10,
  description: "Shows the current song",
  execute(message: Message)
  {
    const song = bot.player.getQueue(message.guild!.id)!.nowPlaying();

    if (!song)
    {
      message.reply("There is no song playing right now!");
      return;
    }

    //SEND EMBED MESSAGE
    const embed = new EmbedBuilder({
      "title": `Now Playing`,
      "description": "",
      "color": 0x7b00ff,
      "fields": [
        {
          "name": "\u200B",
          "value": `[${song.title}](${song.url})\n\`Duration: ${song.duration}\``
        },
        {
          "name": "\u200B",
          "value": `Requested by <@${(song.queue! as Queue<any>).metadata!.message.author.id}>`,
          "inline": true
        }
      ],
      "thumbnail": {
        "url": song.thumbnail,
        "height": 0,
        "width": 0
      }
    });

    message.reply({ embeds: [embed] });
  }
};
