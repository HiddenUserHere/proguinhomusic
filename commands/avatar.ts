import { Message, TextChannel } from "discord.js";

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

export default {
    name: "avatar",
    description: 'Get the avatar of a user',
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
                let avatar = userGuild!.displayAvatarURL({ size: 1024 });
                if (avatar !== null && avatar !== undefined)
                {
                    //Embed the image
                    (message.channel as TextChannel).send({
                        embeds: [{
                            color: 0x0099ff,
                            title: `${user!.username}'s Avatar`,
                            description: `Here is ${user!.username}'s avatar\n\nRequested by <@${message.author.id}>`,
                            image: {
                                url: avatar,
                            },
                        }],
                    });
                }
                else
                {
                    message.reply("This user does not have an avatar!");
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
