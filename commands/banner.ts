import { Message, TextChannel } from "discord.js";

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

export default {
    name: "banner",
    description: 'Get the banner of a user',
    execute(message: Message)
    {
        //Check if the user was mentioned
        if (message.mentions.users.size)
        {
            //Get the first mentioned user
            let user = message.mentions.users.first();
            let userGuild = message.guild!.members.cache.get(user!.id);
            if (userGuild !== null && userGuild !== undefined)
            {
                const banner = user!.bannerURL({ size: 1024 });
                if (banner !== null && banner !== undefined)
                {
                    //Embed the image
                    (message.channel as TextChannel).send({
                        embeds: [{
                            color: 0x0099ff,
                            title: `${user!.username}'s Banner`,
                            description: `Here is ${user!.username}'s banner\n\nRequested by <@${message.author.id}>`,
                            image: {
                                url: banner,
                            },
                        }],
                    });
                }
                else
                {
                    message.reply("This user does not have a banner!");
                }
            }
            else
            {
                message.reply("This user is not in this server!");
            }
        }
        else
        {
            message.reply("You need to mention a user!");
        }
    }
};
