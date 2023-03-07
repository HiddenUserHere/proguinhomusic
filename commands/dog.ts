import { Message, TextChannel } from "discord.js";

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

/**
 * Generates a random dog photo URL
 * using https://dog.ceo/api/breeds/image/random
 * @returns {string} The URL of the random dog photo
 */
async function generateRandomDog()
{
    let data = await fetch("https://dog.ceo/api/breeds/image/random");

    //If the request failed, return a default URL
    if (!data.ok)
        return "https://images.dog.ceo/breeds/hound-english/n02089973_3480.jpg";
    
    //Parse the JSON
    let json = await data.json();

    //Return the URL
    if(json.status !== "success")
        return "https://images.dog.ceo/breeds/hound-english/n02089973_3480.jpg";
    
    return json.message;
}

async function generateSelfRandomDog(name: string)
{
    let data = await fetch(`https://prog.nbstech.com.br/dogs/?dog=${name}`);

    //If the request failed, return a default URL
    if (!data.ok)
        return "https://prog.nbstech.com.br/dogs/lobinho/1.png";

    //Parse the JSON
    let json = await data.json();

    //Return the URL
    if (json.status !== "success")
        return "https://prog.nbstech.com.br/dogs/lobinho/1.png";

    return json.message;
}

export default {
    name: "dog",
    description: 'Generates a random dog photo',
    async execute(message: Message, args: string[])
    {
        //Generates the URL, random between anime and waifu
        let url = await generateRandomDog();

        if (args.length > 0)
        {
            let dog = args[0].toLowerCase();
            url = await generateSelfRandomDog(dog);
        }

        //Is video?
        if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov"))
        {
            let videoName = `dog-${zeroPad(Math.floor(Math.random() * 1000000), 3)}.mp4`;
            //Embed the video
            (message.channel as TextChannel).send({
                embeds: [{
                    color: 0x0099ff,
                    title: 'Random Dog Video',
                    description: `Here is a random dog video\n\nRequested by <@${message.author.id}>`,
                    video: {
                        //URL from attachment
                        url: `attachment://${videoName}`,
                    },
                }],
                files: [{
                    attachment: url,
                    name: videoName,
                }],
            });

            //Send the video
            //message.channel.send(url);
        }
        else
        {
            //Embed the image
            (message.channel as TextChannel).send({
                embeds: [{
                    color: 0x0099ff,
                    title: 'Random Dog Photo',
                    description: `Here is a random dog photo\n\nRequested by <@${message.author.id}>`,
                    image: {
                        url: url,
                    },
                }],
            });
        }
    }
};
