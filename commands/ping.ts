import { Message } from "discord.js";

export default {
  name: "ping",
  cooldown: 10,
  description: "Ping the bot",
  execute(message: Message) {
    message
      .reply('ping: ' + Math.round(message.client.ws.ping) + 'ms')
      .catch(console.error);
  }
};
