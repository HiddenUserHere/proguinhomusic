import { Message } from "discord.js";
import { bot } from "..";
import { i18n } from "../utils/i18n";

export default {
  name: "move",
  aliases: ["mv"],
  description: i18n.__("move.description"),
  execute(message: Message, args: number[])
  {
    
    //Get the musics in the queue
    const queue = bot.player.getQueue(message.guild!.id);
    const musics = queue!.tracks;

    //Get the position of the music to move
    let position = args[0];

    if (position === undefined)
    {
      message.reply("❌ Invalid position!");
      return;
    }

    position = position - 1;

    //Get the position where to move the music
    let newPosition = args[1];

    if (newPosition === undefined)
      newPosition = 1;
    
    
    newPosition = newPosition - 1;

    //Check if the position is valid
    if (position < 0 || position >= musics.length)
    {
      message.reply("❌ Invalid position!");
      return;
    }

    //Check if the new position is valid
    if (newPosition < 0 || newPosition >= musics.length)
    {
      message.reply("❌ Invalid new position!");
      return;
    }

    //Move the music
    const music = musics[position];

    musics.splice(position, 1);

    musics.splice(newPosition, 0, music);

    //Send a message
    message.reply(`➡️ Moved **${music.title}** from position **#${position + 1}** to position **#${newPosition + 1}**!`);
  }
};
