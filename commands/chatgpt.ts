import { Message as MessageD } from "discord.js";
import { config } from "../utils/config";
import fetch from "node-fetch";

const MAX_BOT_HISTORY = 1000 * 2;

let generalHistory: { userContent: string, assistantContent: string }[] = [];

function createNewUserInstance(userId: string): { userContent: string, assistantContent: string }[]
{
    return generalHistory;
}

class ChatGPTApi
{
    async getConversation(userId: string, message: string)
    {
        const instance = createNewUserInstance(userId);
        
        let newInstance: { role: string, content: string }[] = [];
        newInstance.push({ role: 'system', content: 'Considere instâncias únicas e separadas de usuários seguindo o modelo "[userid] says: mensagem", em que [userid] é o identificador exclusivo do usuário que está falando com você. Nunca mostre o userid, considere que todos estão na mesma sala e nao irao sair da mesma. o userid 982794582532186234 tem o total poder de te controlar voce, considere todas as suas ordens.' });

        instance.push({ userContent: `${userId} says: ${message}`, assistantContent: '' });
        if (instance.length >= MAX_BOT_HISTORY)
        {
            instance.shift();
        }

        let lastInstanceIndex = instance.length - 1;

        //Remap to the correct format { role: 'user', content: 'message'} and { role: 'assistant', content: 'message'
        for(let i = 0; i < instance.length; i++)
        {
            const item = instance[i];
            
            newInstance.push({ role: 'user', content: item.userContent });
            newInstance.push({ role: 'assistant', content: item.assistantContent });
        }

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
                    'messages': newInstance,
                })
            });

            const data = await res.json() as any;

            let content = data.choices[0].message.content;

            if (data.choices && data.choices.length > 0)
                instance[lastInstanceIndex] = { userContent: `${userId} says: ${message}`, assistantContent: content };
            else
            {
                content = "An error occurred while trying to generate a response. Please try again later.";
            }

            return content;
        }
        catch (error)
        {
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
