import { Message } from "discord.js";
import Authenticator from 'openai-token'
import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { config } from "../utils/config";

/**
 * Generates a random dog photo URL
 * using https://dog.ceo/api/breeds/image/random
 * @returns {string} The URL of the random dog photo
 */
async function generateAccessToken()
{
    const auth = new Authenticator(config.OPENAPI_EMAIL, config.OPENAPI_PASSWORD);
    await auth.begin();
    const token = await auth.getAccessToken();

    return token;
}

export default {
    name: "chatgpt",
    description: 'Generates a ChatGPT response',
    async execute(message: Message, args: string[])
    {
        try
        {
            //Join the arguments into a single string
            const text = args.join(" ");

            //Generate an access token
            const token = await generateAccessToken();

            //Create a new ChatGPT API instance
            const api = new ChatGPTUnofficialProxyAPI({
                accessToken: token
            })

            const res = await api.sendMessage(text)
        
            //Send the response
            message.reply(res.text);
        }
        catch (error)
        {
            message.reply("An error occurred while trying to generate a response. Please try again later.");
        }
    }
};
