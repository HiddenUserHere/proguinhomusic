import { Playlist, Player, Queue, PlayerEvents, Track } from "discord-player";
import { bot } from "..";

function zeroPad(nr: number, base: number)
{
    var len = (String(base).length - String(nr).length) + 1;
    return len > 0 ? new Array(len).join('0') + nr : nr;
}

export function createEvents(player: Player)
{
    player.on('connectionCreate', (queue) =>
    {
        queue.connection.voiceConnection.on('stateChange', (oldState, newState) =>
        {
            const oldNetworking = Reflect.get(oldState, 'networking');
            const newNetworking = Reflect.get(newState, 'networking');

            const networkStateChangeHandler = (oldNetworkState: any, newNetworkState: any) =>
            {
                const newUdp = Reflect.get(newNetworkState, 'udp');
                clearInterval(newUdp?.keepAliveInterval);
            }

            oldNetworking?.off('stateChange', networkStateChangeHandler);
            newNetworking?.on('stateChange', networkStateChangeHandler);
        });
    });
    player.on('channelEmpty', (queue: Queue<any>) =>
        queue.metadata.channel.send(`⚠️ Everyone left the Voice Channel, queue ended.`));
        // Emitted when a song was added to the queue.
    player.on('trackAdd', (queue: Queue<any>, song: Track) =>
    {
        const position = queue.tracks.length;

        if (position === 0)
            queue.metadata.message.reply(`✅ Song ***${song.title}*** was added to the queue by **${queue.metadata.message.author.username}**.`);
        else
            queue.metadata.message.reply(`✅ Song ***${song.title}*** was added to the queue by **${queue.metadata.message.author.username}** at position **#${position}**.`);
    });
        // Emitted when a playlist was added to the queue.
    player.on('tracksAdd', (queue: Queue<any>, tracks: Track[]) =>
    {
        const position = queue.tracks.length - tracks.length;

        if (position === 0)
            queue.metadata.message.reply(`✅ Playlist with ${tracks.length} songs was added to the queue by **${queue.metadata.message.author.username}**.`);
        else
            queue.metadata.message.reply(`✅ Playlist with ${tracks.length} songs was added to the queue by **${queue.metadata.message.author.username}** at position **#${position}**.`);
    });
        // Emitted when the queue was destroyed (either by ending or stopping).    
    player.on('queueEnd', (queue: Queue<any>) =>
        queue.metadata.channel.send(`🏁 The queue has ended.`));
        // Emitted when a song changed.
    player.on('trackStart', (queue: Queue<any>, song: Track) =>
    {
        //Duration of the song in seconds.
        let duration = parseInt(song.duration);

        //Duration of the song in minutes.
        let minutes = zeroPad(Math.floor(duration / 60), 10);

        //Duration of the song seconds.
        let seconds = zeroPad(Math.floor(duration % 60), 10);

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
                    "value": `Requested by <@${queue.metadata.message.author.id}>`,
                    "inline": true
                }
            ],
            "thumbnail": {
                "url": song.thumbnail,
                "height": 0,
                "width": 0
            }
        };

        queue.metadata.channel.send({ embeds: [embed] });
    });
        // Emitted when someone disconnected the bot from the channel.
    player.on('botDisconnect', (queue: Queue<any>) =>
        queue.metadata.channel.send(`❗ I was kicked from the Voice Channel, queue ended.`));
        // Emitted when there was an error in runtime
    player.on('error', (queue: Queue<any>, error) =>
        {
            //queue.metadata.channel.send(`Error: ${error} in ${queue.guild.name}`);
            console.log(`Error: ${error} in ${queue.guild.name}`);
        });
}