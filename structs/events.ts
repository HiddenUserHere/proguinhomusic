import { Playlist, Player, PlayerEvents, Track } from "discord-player";
import { bot } from "..";

function zeroPad(nr: number, base: number)
{
    var len = (String(base).length - String(nr).length) + 1;
    return len > 0 ? new Array(len).join('0') + nr : nr;
}

function errorOccured(errorStr: any, channel: any = null)
{
    try
    {
        if (channel)
            channel.send(`An error occured, please try again in a few seconds.`);

        console.log(errorStr);
    }
    catch (error)
    {
        console.log(error);
    }
}

export function createEvents(player: Player)
{
    player.events.on('connection', (queue: any) =>
    {
        // queue.connection.voiceConnection.on('stateChange', (oldState, newState) =>
        // {
        //     const oldNetworking = Reflect.get(oldState, 'networking');
        //     const newNetworking = Reflect.get(newState, 'networking');

        //     const networkStateChangeHandler = (oldNetworkState: any, newNetworkState: any) =>
        //     {
        //         const newUdp = Reflect.get(newNetworkState, 'udp');
        //         clearInterval(newUdp?.keepAliveInterval);
        //     }

        //     oldNetworking?.off('stateChange', networkStateChangeHandler);
        //     newNetworking?.on('stateChange', networkStateChangeHandler);
        // });
    });
    player.events.on('emptyChannel', (queue: any) =>
    {
        try
        {
            queue.metadata.channel.send(`⚠️ Everyone left the Voice Channel, queue ended.`);
        }
        catch (error)
        {
            errorOccured(error, queue.metadata.channel);
        }
    });
    // Emitted when a song was added to the queue.
    player.events.on('audioTrackAdd', (queue: any, song: Track) =>
    {
        try
        {
            const position = queue.tracks.data.length;

            if (position === 0)
                queue.metadata.channel.send(`✅ Song ***${song.title}*** was added to the queue by **${queue.metadata.message.author.username}**.`);
            else
                queue.metadata.channel.send(`✅ Song ***${song.title}*** was added to the queue by **${queue.metadata.message.author.username}** at position **#${position}**.`);
        }
        catch (error)
        {
            errorOccured(error, queue.metadata.channel);
        }
    });
    // Emitted when a playlist was added to the queue.
    player.events.on('audioTracksAdd', (queue: any, tracks: Track[]) =>
    {
        try
        {
            const position = queue.tracks.data.length - tracks.length;

            if (position === 0)
                queue.metadata.channel.send(`✅ Playlist with ${tracks.length} songs was added to the queue by **${queue.metadata.message.author.username}**.`);
            else
                queue.metadata.channel.send(`✅ Playlist with ${tracks.length} songs was added to the queue by **${queue.metadata.message.author.username}** at position **#${position}**.`);
        }
        catch (error)
        {
            errorOccured(error, queue.metadata.channel);
        }
    });
    // Emitted when the queue was destroyed (either by ending or stopping).    
    player.events.on('emptyQueue', (queue: any) =>
    {
        try
        {
            queue.metadata.channel.send(`🏁 The queue has ended.`);
        }
        catch (error)
        {
            errorOccured(error, queue.metadata.channel);
        }
    });
    // Emitted when a song changed.
    player.events.on('playerStart', (queue: any, song: Track) =>
    {
        try
        {
            let requestedBy = song.requestedBy?.id ? `<@${song.requestedBy.id}>` : queue.metadata.message.author.username ? `<@${queue.metadata.message.author.id}>` : "Unknown";

            //SEND EMBED MESSAGE
            const embed =
            {
                "type": "rich",
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
                        "value": `Requested by ${requestedBy}`,
                        "inline": true
                    },
                    //Powered by Pancake Host
                    {
                        "name": "\u200B",
                        "value": `Powered by [PancakeHost.com](https://www.pancakehost.com/)`,
                    }
                ],
                "thumbnail": {
                    "url": song.thumbnail,
                    "height": 0,
                    "width": 0
                }
            };

            queue.metadata.channel.send({ embeds: [embed] });
        }
        catch (error)
        {
            errorOccured(error, queue.metadata.channel);
        }
    });
    // Emitted when someone disconnected the bot from the channel.
    player.events.on('disconnect', (queue: any) =>
    {
        try
        {
            queue.metadata.channel.send(`❗ I was kicked from the Voice Channel, queue ended.`);
        }
        catch (error)
        {
            errorOccured(error, queue.metadata.channel);
        }
    });
        // Emitted when there was an error in runtime
    player.events.on('error', (queue: any, error) =>
        {
            //queue.metadata.channel.send(`Error: ${error} in ${queue.guild.name}`);
            console.log(`Error: ${error} in ${queue.guild.name}`);
        });
}