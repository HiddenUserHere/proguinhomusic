import { VoiceConnection } from "@discordjs/voice";
import { Message, TextChannel } from "discord.js";

export interface QueueOptions {
  interaction: Message;
  textChannel: TextChannel;
  connection: VoiceConnection;
}
