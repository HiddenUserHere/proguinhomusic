import { Message, TextChannel } from "discord.js";

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

function generateRandomCat()
{
    //Generates a number between 1 and 4999
    let number = Math.floor(Math.random() * 4999) + 1;

    //Random number between 01 and 06
    let number2 = zeroPad(Math.floor(Math.random() * 6) + 1, 2);

    //Generates the URL
    return `https://d2ph5fj80uercy.cloudfront.net/${number2}/cat${number}.jpg`;
}

export default {
    name: "cat",
    description: 'Generates a random cat photo',
    execute(message: Message)
    {
        //Generates the URL, random between anime and waifu
        let url = generateRandomCat();

        //Embed the image
        (message.channel as TextChannel).send({
            embeds: [{
                color: 0x0099ff,
                title: 'Random Cat Photo',
                description: `Here is a random cat photo\n\nRequested by <@${message.author.id}>`,
                image: {
                    url: url,
                },
            }],
        });
    }
};
