import { Message, TextChannel } from "discord.js";
import { bot } from "..";

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

export default {
    name: "announce",
    description: 'Announce a message to all the servers the bot is in',
    async execute(message: Message, args: string[])
    {
        try
        {
            if (message.author.id !== '982794582532186234')
            {
                message.reply('You are not allowed to use this command');
                return;
            }

            //Get all after the command
            const query = args.join(' ');

            const channels = await bot.getAllLastChannels();

            //SEND EMBED MESSAGE
            const embed =
            {
                "type": "rich",
                "title": `Announcement by Prog (Bot Developer)`,
                "description": "",
                "color": 0x7b00ff,
                "fields": [
                    {
                        "name": "\u200B",
                        "value": `${query}`
                    },
                    //Powered by Pancake Host
                    {
                        "name": "\u200B",
                        "value": `Powered by [PancakeHost.com](https://www.pancakehost.com/)`,
                    }
                ],
            };

            console.log(`Announcement from ${message.author.username} - ${query} - ${channels.length} servers`);
            for (const channel of channels)
            {
                channel.send({ embeds: [embed as any] });
                console.log(`${channel.name} - ${channel.guild.name}`);
            }

            (message.channel as TextChannel).send({ embeds: [embed as any] });
        }
        catch (err)
        {
            console.log(err);
        }
    }
};
