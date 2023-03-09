import { Message, EmbedBuilder } from "discord.js";
import { bot } from "../index";

export default {
  name: "help",
  aliases: ["h"],
  description: "Shows the help menu",
  execute(message: Message) {
    let commands = bot.commands;

    let helpEmbed = new EmbedBuilder()
      .setTitle("Help")
      .setDescription("Here is the list of all the commands")
      .setColor("#F8AA2A");

    commands.forEach((cmd) =>
    {
      let embed: { name: string; value: string; inline: boolean; } = {
        name: `**${bot.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        value: `${cmd.description}`,
        inline: true
      };
      return helpEmbed.addFields(embed);
    });

    helpEmbed.setTimestamp();

    return message.reply({ embeds: [helpEmbed] }).catch(console.error);
  }
};
