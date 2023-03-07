import { Message, EmbedBuilder } from "discord.js";

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

/**
 * Generates a random dog photo URL
 * using https://dog.ceo/api/breeds/image/random
 * @returns {string} The URL of the random dog photo
 */
async function getMovieInfo(name: string)
{
    let data = await fetch(`http://www.omdbapi.com/?t=${name}&apikey=533fdea8`);
    let movieEmbed = new EmbedBuilder();        
    if (!data.ok)
    {
        movieEmbed.setTitle(name)
            .setDescription("Movie not found!")
            .setColor("#F8AA2A");
        
        return movieEmbed;
    }

    let json = await data.json();
    if (json.Response === "False")
    {
        movieEmbed.setTitle(name)
            .setDescription("Movie not found!")
            .setColor("#F8AA2A");

        return movieEmbed;
    }

    movieEmbed.setTitle(json.Title);
    movieEmbed.setDescription(json.Plot);
    movieEmbed.addFields(
        { name: "Title", value: json.Title, inline: true },
        { name: "Year", value: json.Year, inline: true },
        { name: "Released", value: json.Released, inline: true },
        { name: "Duration", value: json.Runtime, inline: true },
        { name: "Genre", value: json.Genre, inline: true },
        { name: "Director", value: json.Director, inline: true },
        { name: "Actors", value: json.Actors, inline: true },
        { name: "IMDB Rating", value: json.imdbRating, inline: true },
    );

    if (json.Poster.includes("http"))
        movieEmbed.setImage(json.Poster);

    return movieEmbed;
}

export default {
    name: "movie",
    description: 'Return the movie info by its title',
    async execute(message: Message, args: string[])
    {
        //Unsplit args with space
        let name = args.join(" ");

        //Embed the image
        message.reply({
            embeds: [await getMovieInfo(name)],
        });
    }
};
