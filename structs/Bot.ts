import {
  ApplicationCommandDataResolvable,
  Message,
  Client,
  Collection,
  Events,
  REST,
  Routes,
  Snowflake
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../interfaces/Command";
import { checkPermissions, PermissionResult } from "../utils/checkPermissions";
import { config } from "../utils/config";
import { i18n } from "../utils/i18n";
import { MissingPermissionsException } from "../utils/MissingPermissionsException";
import { MusicQueue } from "./MusicQueue";

export class Bot {
  public readonly prefix = "+";
  public commands = new Collection<string, Command>();
  public slashCommands = new Array<ApplicationCommandDataResolvable>();
  public slashCommandsMap = new Collection<string, Command>();
  public cooldowns = new Collection<string, Collection<Snowflake, number>>();
  public queues = new Collection<Snowflake, MusicQueue>();

  public constructor(public readonly client: Client) {
    this.client.login(config.TOKEN);

    this.client.on("ready", () => {
      console.log(`${this.client.user!.username} ready!`);

      this.registerSlashCommands();
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.onInteractionCreate();
  }

  private async registerSlashCommands() {
    const rest = new REST({ version: "9" }).setToken(config.TOKEN);

    const commandFiles = readdirSync(join(__dirname, "..", "commands")).filter((file) => !file.endsWith(".map"));

    for (const file of commandFiles) {
      const command = await import(join(__dirname, "..", "commands", `${file}`));

      this.slashCommands.push(command.default.data);
      this.slashCommandsMap.set(command.default.data.name, command.default);
    }

    await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });
  }

  private async onInteractionCreate() {
    this.client.on(Events.MessageCreate, async (message: Message) => {
      if(message.content.charAt(0) !== this.prefix) return;

      const args = message.content.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift()!.toLowerCase();

      //Entire input string
      const input = message.content.slice(this.prefix.length + commandName.length).trim();

      const command = this.slashCommandsMap.get(commandName);

      if (!command) return;

      
      try {
        const permissionsCheck: PermissionResult = await checkPermissions(command, message);

        if (permissionsCheck.result) {
          command.execute(message, input.split(" "));
        } else {
          throw new MissingPermissionsException(permissionsCheck.missing);
        }
      } catch (error: any) {
        console.error(error);

        if (error.message.includes("permissions")) {
          message.reply({ content: error.toString() }).catch(console.error);
        } else {
          message.reply({ content: i18n.__("common.errorCommand") }).catch(console.error);
        }
      }
    });
  }
}
