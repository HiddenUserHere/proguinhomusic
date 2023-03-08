import { Message as MessageD } from "discord.js";
import { config } from "../utils/config";
import { v4 as uuidv4 } from 'uuid';

import Authenticator from 'openai-token';

export interface Content
{
    content_type: string;
    parts: string[];
}

export interface Message
{
    content: Content;
    id: string;
    role: string;
}

export interface ConversationPayload
{
    action: string;
    conversation_id?: string;
    messages: Message[];
    model: string;
    parent_message_id: string;
}

export const getSession = async () =>
{
    const auth = new Authenticator(config.OPENAI_EMAIL, config.OPENAI_PASSWORD);
    await auth.begin();
    const token = await auth.getAccessToken();

    return token;
};

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

        const data = await res.json();

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
        
            //Send the response
            message.reply(res);
        }
        catch (error)
        {
            console.error(error);
            message.reply("An error occurred while trying to generate a response. Please try again later.");
        }
    }
};
