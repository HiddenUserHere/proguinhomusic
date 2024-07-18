import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { Message, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern } from "../utils/patterns";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(i18n.__("play.description"))
    .addStringOption((option) => option.setName("song").setDescription("The song you want to play").setRequired(true)),
  cooldown: 3,
  permissions: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
  async execute(interaction: Message, args: string[]) {
    let argSongName = args.join(" ");

    const guildMember = interaction.guild!.members.cache.get(interaction.author.id);
    const { channel } = guildMember!.voice;

    if (!channel)
      return interaction.reply({ content: i18n.__("play.errorNotChannel") }).catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
      return interaction
        .reply({
          content: i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username })
        })
        .catch(console.error);

    if (!argSongName)
      return interaction
        .reply({ content: i18n.__mf("play.usageReply", { prefix: bot.prefix })})
        .catch(console.error);

    const url = argSongName;

    await interaction.reply("⏳ Loading...");

    let song = null;

    try {
      song = await Song.from(url, url);
    } catch (error: any) {
      console.error(error);

      if (error.name == "NoResults")
        return interaction
          .reply({ content: i18n.__mf("play.errorNoResults", { url: `<${url}>` }) })
          .catch(console.error);

      if (error.name == "InvalidURL")
        return interaction
          .reply({ content: i18n.__mf("play.errorInvalidURL", { url: `<${url}>` }) })
          .catch(console.error);

      else return interaction.reply({ content: i18n.__("common.errorCommand") }).catch(console.error);
    }

    if (queue) {
      queue.enqueue(song);

      return (interaction.channel as TextChannel)
        .send({ content: i18n.__mf("play.queueAdded", { title: song.title, author: interaction.author.id }) })
        .catch(console.error);
    }

    const newQueue = new MusicQueue({
      interaction,
      textChannel: interaction.channel! as TextChannel,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
    });

    bot.queues.set(interaction.guild!.id, newQueue);

    newQueue.enqueue(song);
  }
};
