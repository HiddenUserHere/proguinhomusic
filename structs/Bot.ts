import { Player } from "discord-player";
import { ActivityType, ChannelType, Client, Collection, Snowflake, TextChannel } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../interfaces/Command";
import { checkPermissions } from "../utils/checkPermissions";
import { config } from "../utils/config";
import { MissingPermissionsException } from "../utils/MissingPermissionsException";
import { createEvents } from "./events";
import { onSearchType } from "../commands/search";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class Bot {
  public readonly prefix = config.PREFIX;
  public commands = new Collection<string, Command>();
  public cooldowns = new Collection<string, Collection<Snowflake, number>>();
  public player: Player;

  public constructor(public readonly client: Client)
  {
    this.player = new Player(client, {});
    
    createEvents(this.player);

    this.client.login(config.TOKEN);

    this.client.on("ready", () => {
      console.log(`${this.client.user!.username} ready!`);
      client.user!.setActivity(`by PancakeHost.com`, { type: ActivityType.Streaming });
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.importCommands();
    this.onMessageCreate();
  }

  private async importCommands() {
    await this.player.extractors.loadDefault();

    const commandFiles = readdirSync(join(__dirname, "..", "commands")).filter((file) => !file.endsWith(".map"));

    for (const file of commandFiles) {
      const command = await import(join(__dirname, "..", "commands", `${file}`));
      this.commands.set(command.default.name, command.default);
    }
  }

  private async onMessageCreate() {
    this.client.on("messageCreate", async (message: any) =>
    {
      if (message.author.bot || !message.guild) return;

      if (message.content.toLowerCase() === "oi filho")
      {
        if (message.author.id === "982794582532186234")
        {
          message.reply("Oi pai 😈");
        }
        return;
      }

      onSearchType(message);

      const prefixRegex = new RegExp(`^(<@!?${this.client.user!.id}>|${escapeRegex(this.prefix)})\\s*`);
      if (!prefixRegex.test(message.content)) return;

      const [, matchedPrefix] = message.content.match(prefixRegex);

      const args: string[] = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();

      // @ts-ignore
      const command =
        // @ts-ignore
        this.commands.get(commandName!) ?? this.commands.find((cmd) => cmd.aliases?.includes(commandName));

      if (!command) return;

      if (!this.cooldowns.has(command.name)) {
        this.cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps: any = this.cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 1) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      try {
        const permissionsCheck: any = await checkPermissions(command, message);

        if (permissionsCheck.result)
        {
          command.execute(message, args);
        } else {
          throw new MissingPermissionsException(permissionsCheck.missing);
        }
      } catch (error: any) {
        console.error(error);

        if (error.message.includes("permissions")) {
          message.reply(error.toString()).catch(console.error);
        } else {
          message.reply("An error occurred while executing this command!");
        }
      }
    });
  }

  //Get all last channels from all guilds this bot was sent messages
  //Get only if bot have sent messages in this channel
  public async getAllLastChannels() : Promise<TextChannel[]>
  {
    let channelList: TextChannel[] = [];

    const servers = this.client.guilds.cache;
    for (const [, value] of servers)
    {
      try
      {
        const guild = value;

        let found = false;
        const channels = guild.channels.cache;
        for(const [, valueCh] of channels)
        {
          if (found)
            break;

          const channel = valueCh;
          if (channel.type === ChannelType.GuildText)
          {
            try
            {
              //Get Last 150 messages from this channel
              const messages = await channel.messages.fetch({ limit: 100 });
              for(const [, valueMessage] of messages)
              {
                if (found)
                  break;
                if (valueMessage.author.id === this.client.user!.id)
                {
                  console.log(`Last channel: ${channel.name}`);
                  channelList.push(channel as any);
                  found = true;
                  break;
                }
              }

            } catch (e)
            {
            }
          }
        }
      }
      catch (e)
      {
      }
    }  

    console.log(`Found ${channelList.length} channels`);

    return channelList;
  }

  public async deleteMessage(id: string)
  {
    const servers = this.client.guilds.cache;
    for (const [, value] of servers)
    {
      try
      {
        const guild = value;

        const channels = guild.channels.cache;
        for(const [, valueCh] of channels)
        {
          const channel = valueCh;
          if (channel.type === ChannelType.GuildText)
          {
            try
            {
              //Get Last 150 messages from this channel
              const messages = await channel.messages.fetch({ limit: 100 });
              for(const [, valueMessage] of messages)
              {
                const message = valueMessage;
                if (message.id === id)
                {
                  message.delete();
                  return;
                }
              }

            } catch (e)
            {
            }
          }
        }
      }
      catch (e)
      {
      }
    }
  }
}
