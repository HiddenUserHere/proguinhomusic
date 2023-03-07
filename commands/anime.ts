import { Message, TextChannel } from "discord.js";

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

function generateAnimeURL(): string
{
    //Generates a number between 00001 and 99999
    let number = Math.floor(Math.random() * 99999) + 1;

    //Adds a 0 to the left if the number is less than 10000
    let numberString = zeroPad(number, 5);

    //Generates the URL
    return `https://thisanimedoesnotexist.ai/results/psi-0.8/seed${numberString}.png`;
}

function generateWaifuURL()
{
    //Generates a number between 1 and 99999
    let number = Math.floor(Math.random() * 99999) + 1;

    //Generates the URL
    return `https://thiswaifudoesnotexist.net/example-${number}.jpg`;
}

export default {
    name: "anime",
    description: 'Generates a random anime photo',
    execute(message: Message)
    {
        //Generates the URL, random between anime and waifu
        let url = Math.random() > 0.5 ? generateAnimeURL() : generateWaifuURL();

        //Embed the image
        (message.channel as TextChannel).send({
            embeds: [{
                color: 0x0099ff,
                title: 'Random Anime Photo',
                description: `Here is a random anime photo\n\nRequested by <@${message.author.id}>`,
                image: {
                    url: url,
                },
            }],
        });
    }
};
