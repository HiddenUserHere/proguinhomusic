import { Message } from "discord.js";

export default {
  name: "invite",
  description: "Invite the bot to your server",
  execute(message: Message) {
    return message
      .member!.send(
        `https://discord.com/oauth2/authorize?client_id=${
          message.client.user!.id
        }&permissions=70282305&scope=bot
    `
      )
      .catch(console.error);
  }
};
