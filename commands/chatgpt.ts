import { Message as MessageD } from "discord.js";
import { config } from "../utils/config";
import fetch from "node-fetch";


class ChatGPTApi
{
    async getConversation(message: string)
    {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.OPENAI_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            // body: '{\n "model": "gpt-3.5-turbo",\n "messages": [{"role": "user", "content": "What is the OpenAI mission?"}]\n}',
            body: JSON.stringify({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'user',
                        'content': message
                    }
                ]
            })
        });

        const data = await res.json() as any;

        return data.choices[0].message.content;
    }
}

export default {
    name: "chatgpt",
    description: 'Generates a ChatGPT response',
    aliases: ['c'],
    async execute(message: MessageD, args: string[])
    {
        try
        {
            //Join the arguments into a single string
            const text = args.join(" ");

            const chat = new ChatGPTApi();

            //Get the response
            const res = await chat.getConversation(text);
        
            //Split the response into multiple messages if it's more than 4000 characters
            if (res.length > 4000)
            {
                const split = res.split("\n");
                let current = "";
                for (let i = 0; i < split.length; i++)
                {
                    if (current.length + split[i].length > 4000)
                    {
                        message.reply(current);
                        current = "";
                    }

                    current += split[i] + "\n";
                }

                if (current.length > 0)
                    message.reply(current);
                return;
            }

            message.reply(res);
        }
        catch (error)
        {
            console.error(error);
            message.reply("An error occurred while trying to generate a response. Please try again later.");
        }
    }
};
