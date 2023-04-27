import { QueryType, Track } from "discord-player";
import { Message, TextChannel } from "discord.js";
import { bot } from "../index";

export default {
    name: "search",
    aliases: ["r"],
    description: 'Search for a song.',
    async execute(message: Message)
    {
        
        const query = message.content.split(' ').slice(1).join(' ');
        if (!query) return message.reply('⚠️ Please provide a query to search for!');

        const result = await bot.player
            .search(query, {
                requestedBy: message.author,
                searchEngine: QueryType.YOUTUBE
            })
            .catch(() =>
            {
                console.log('he');
            });
        if (!result || !result.tracks.length) return message.reply('No results were found!');

        //Add the results to an array with name and url
        let results = [];
        for (let i = 0; i < result.tracks.length; i++)
        {
            const item = result.tracks[i];
            //if (item.playlist === 'video' || item.type === 'playlist')
            {
                results.push({
                    type: 'video',
                    name: item.title,
                    url: item.url,
                    track: item
                });
            }
        }

        let queue = bot.player.queues.cache.find((queue) => queue.guild.id === message.guild!.id);
        if (queue)
        {
            queue.metadata = {
                searchData: results,
                searchAuthor: message.author,
                channel: message.channel,
                message: message,
                requestedBy: message.author
            };
        }
        else
        {
            queue = bot.player.queues.create(message.guild!, {
                leaveOnEndCooldown: 1000 * 60 * 2,
                leaveOnEmptyCooldown: 1000 * 60 * 2,
                // ytdlOptions: {
                //     quality: 'highest',
                //     filter: 'audioonly',
                //     highWaterMark: 1 << 25,
                //     dlChunkSize: 0
                // },
                metadata: {
                    searchData: results,
                    searchAuthor: message.author,
                    channel: message.channel,
                    message: message,
                    requestedBy: message.author
                }
            });
        }
        
        try
        {
            if (!queue.connection) await queue.connect(message.member!.voice!.channel!);
        } catch {
            bot.player.queues.delete(message.guild!.id);
            message.reply('❌ | Could not join your voice channel!');
        }

        //Send the results to the user
        let embed = {
            title: 'Search results',
            description: 'Choose a result from the list below, or type cancel.\n\n',
            color: 0x6E6E6E
        };
        
        for (let i = 0; i < results.length; i++)
        {
            const result = results[i];
            embed.description += `**${i + 1}.** [${result.name}](${result.url})\n`;
        }

        (message.channel as TextChannel).send({ embeds: [embed] });
    }
};


export function onSearchType(message: Message)
{
    //Get Queue
    const queue = bot.player.queues.cache.find((queue) => queue.guild.id === message.guild!.id);

    if (!queue)
    {
        return;
    }

    //Get the search data
    const searchData = (queue.metadata as any).searchData;
    const searchAuthor = (queue.metadata as any).searchAuthor;
    if (!searchData || !searchAuthor)
    {
        return;
    }

    //Cancel search?
    if (message.content === 'cancel' || (queue.metadata as any).searchAuthor.id !== message.author.id)
    {
        //Reset to default
        queue.metadata =
        {
            channel: message.channel,
            message: message
        };

        (message.channel as TextChannel).send('❌ Search cancelled.');

        return;
    }


    //Message content is a number?
    if (!isNaN(parseInt(message.content)))
    {
        const index = parseInt(message.content) - 1;
        
        //Check if the index is valid
        if (index < 0 || index > searchData.length - 1)
        {
            message.reply('Invalid index!');
            return;
        }

        //Get the item
        const item = searchData[index];

        //Play the item
        if (item.type === 'video')
        {
            if (queue.isPlaying())
            {
                queue.addTrack(item.track as Track);
            }
            else
            {
                bot.player.play(message.member!.voice!.channel!, item.track as Track);
            }
        }

        //Reset to default
        queue.metadata =
        {
            channel: message.channel,
            message: message
        };
    }
}