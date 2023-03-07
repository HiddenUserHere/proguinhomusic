import { Message, EmbedBuilder } from "discord.js";
import { i18n } from "../utils/i18n";
import { bot } from "../index";

export default {
  name: "help",
  aliases: ["h"],
  description: i18n.__("help.description"),
  execute(message: Message) {
    let commands = bot.commands;

    let helpEmbed = new EmbedBuilder()
      .setTitle(i18n.__mf("help.embedTitle", { botname: message.client.user!.username }))
      .setDescription(i18n.__("help.embedDescription"))
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
