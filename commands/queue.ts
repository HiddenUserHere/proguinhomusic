import { Message, EmbedBuilder, Embed, EmbedType, TextChannel } from "discord.js";
import { bot } from "../index";

function zeroPad(nr: number, base: number)
{
  var len = (String(base).length - String(nr).length) + 1;
  return len > 0 ? new Array(len).join('0') + nr : nr;
}

export default {
  name: "queue",
  cooldown: 10,
  description:'Shows the queue',
  execute(message: Message)
  {
    const queue = bot.player.getQueue(message.guild!.id);

    if (!queue)
    {
      message.reply("There is no queue!");
      return;
    }

    //Send the results to the user
    let embed = {
      title: 'Queue List',
      description: '\n\n',
      color: 0x6E6E6E
    };
   
    for (let i = 0; i < queue.tracks.length; i++)
    {
      const result = queue.tracks[i];
      embed.description += `**${i + 1}.** [${result.title}](${result.url})\n`;
    }

    (message.channel as TextChannel).send({ embeds: [embed] });
  }
};
