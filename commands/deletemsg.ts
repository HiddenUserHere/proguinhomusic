import { Message, TextChannel } from "discord.js";
import { bot } from "..";

export default {
  name: "deletemsg",
  cooldown: 10,
  description: "aaaa",
  execute(message: Message, args: string[]) {
    const channelId = args[0];
    const messageId = args[1];

    bot.client.channels.fetch(channelId).then(channel =>
    {
      (channel! as TextChannel).messages.delete(messageId);
    });
  }
};
