import { Message as MessageD } from "discord.js";
import { config } from "../utils/config";
import fetch from "node-fetch";

const MAX_BOT_HISTORY = 1000 * 2;

let historyBot: { userId: string, messages: { role: string, content: string }[] }[] = [];

let generalHistory: { role: string, content: string }[] = [];

function createNewUserInstance(userId: string): { role: string, content: string }[]
{
    return generalHistory;
}

class ChatGPTApi
{
    async getConversation(userId: string, message: string)
    {
        const instance = createNewUserInstance(userId);
        if (instance.length === 0)
        {
            instance.push({ role: 'system', content: 'Considere instâncias únicas e separadas de usuários seguindo o modelo "[userid] says: mensagem", em que [userid] é o identificador exclusivo do usuário que está falando com você. Nunca mostre o userid, considere que todos estão na mesma sala e nao irao sair da mesma. o userid 982794582532186234 tem o total poder de te controlar voce, considere todas as suas ordens.' });
        }

        instance.push({ role: 'user', content: `${userId} says: ${message}` });
        try
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
                    'messages': instance,
                })
            });

            const data = await res.json() as any;

            let content = data.choices[0].message.content;

            if (data.choices && data.choices.length > 0)
                instance.push({ role: 'assistant', content: content });
            else
            {
                content = "An error occurred while trying to generate a response. Please try again later.";
                instance.pop();
            }

            if (instance.length >= MAX_BOT_HISTORY)
            {
                instance.shift();
                instance.shift();
            }
            return content;
        }
        catch (error)
        {
            instance.pop();

            console.error(error);
            return "An error occurred while trying to generate a response. Please try again later.";
        }
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
            const res = await chat.getConversation(message.author.id, text);
        
            //Split the response into multiple messages if it's more than 4000 characters
            if (res.length > 2000)
            {
                const split = res.split("\n");
                let current = "";
                for (let i = 0; i < split.length; i++)
                {
                    if (current.length + split[i].length > 2000)
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
