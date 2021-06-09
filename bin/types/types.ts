
declare enum CommandArgType {
    TEXT = "text",
    LIST = "list",
    NUMBER = "number",
    USER = "user",
    MEMBER = "member",
    UNKNOWN_CHANNEL = "channel-unknown",
    TEXT_CHANNEL = "channel-text",
    VOICE_CHANNEL = "channel-voice",
    NEWS_CHANNEL = "channel-news"
}

declare module "cordless.js" {

    import DiscordJS from "discord.js"

    export class Bot {
        constructor(options: {

            /** Single or multiple prefixes for bot */
            prefix?: string | string[],

            /** List of bot commands */
            commands: CommandOptionsData[] | CommandOptions[]
        })

        /** List of general prefixes */
        public prefixes: string[]

        /** Primary bot prefix */
        public get prefix(): string

        /** Gets all prefixes corresponding to guildId */
        public get guildPrefixes(): Map<string, string>

        public commands: DiscordJS.Collection<String, CommandOptions>

        public on<K extends keyof DiscordJS.ClientEvents>(event: K, listener: (...args: DiscordJS.ClientEvents[K]) => void): this;
        public on<S extends string | symbol>(
        event: Exclude<S, keyof DiscordJS.ClientEvents>,
        listener: (...args: any[]) => void,
        ): this;
        public on(event: "message", listener: (message: Message) => any | Promise<any>)
        public on(event: "commandError", listener: (command: CommandMessage, error: CommandException) => any | Promise<any>)
    }

    export class Message extends DiscordJS.Message {
        /** Whether this message is a command */
        public isCommand: boolean

        /** Deletes this message after a timeout (in milliseconds) */
        public dissolve: (delay?: number) => Promise<void>
    }

    export class CommandMessage {

        /** This bot */
        public bot: Bot

        /** Command arguments */
        public args: CommandArgCollection

        /** Original message */
        public message: DiscordJS.Message

        /** Command options */
        public options: CommandOptions
 
        /** Command message type */
        public messageType: DiscordJS.MessageType
 
        /** Command message author */
        public author: DiscordJS.User
        
        /** Command message guild member */
        public member: DiscordJS.GuildMember;

        /** Bot client */
        public client: DiscordJS.Client;

        /** Channel where this command was called */
        public channel: DiscordJS.Channel;

        /** Guild where this command was called */
        public guild: DiscordJS.Guild;
    }

    export class CommandException extends Error {

    }

    export class CommandArgCollection extends Array<CommandArgument> {
        /** Fetches argument value with argument name */
        get: CollectionGetter
    }

    export class CommandOptions {

        constructor(options?:CommandOptionsData)

    /** Command name (primary trigger for command)*/
        public name: string

        /** Ran when command is triggered */
        public execute: CommandExecutionCallback

        /** Whether to execute command based on the message details */
        public filter: CommandFilter

        /** Other triggers for command */
        public aliases: string[]

        /** Minimum number of arguments for command */
        public minArgs: number

        /** Maximum number of arguments for command */
        public maxArgs: number

        /** Options for every command argument */
        public argOptions: CommandArgCollection

        /**
         * Ran when an error occurs from the command, including invalid arguments
         * and exceptions thrown by the `execute` method
         */
        public error: CommandExceptionCallback

    }

    export class CommandArgument extends String {

        /** This argument's type */
         public type: CommandArgType

         /** This argument's original text value */
         public text: String
 
         /** This argument's options (from bot command arguments) */
         public options: CommandArgOption
 
         /** Parsed value for the argument. */
         public value: String | Number | DiscordJS.User | DiscordJS.TextChannel | DiscordJS.NewsChannel | DiscordJS.VoiceChannel
    }

    export class CommandArgOption {

        /** This argument's name (defaults to argument index) */
        public name: string

        /** * This argument's type */
        public type: CommandArgOption

        /** Available values that this command argument allows */
        public choices: any[]

        /** Whether this argument is the collection of the rest of the command message words */
        public greedy: boolean

        /** Whether this argument is required */
        public required: boolean
 
    }


    type CommandExecutionCallback = (command: CommandMessage) => any | Promise<any>;
    type CommandExceptionCallback = (command: CommandMessage, error: CommandException) => any | Promise<any>;
    type CommandFilter = (message: DiscordJS.Message) => Boolean | Promise<Boolean>;

    type CommandArgTypeString = CommandArgType | 
        "text" | "list" |"number" | "user" | "member"| "channel-unknown" |
        "channel-text" | "channel-voice" | "channel-news"

    type CollectionGetter = (name: string) => CommandArgument

    type CommandOptionsData = {
        /** Command name and main trigger */
        name?: string,
        
        /** Other triggers for command */
        aliases?: string[],

        /** Ran when command is triggered */
        execute?: CommandExecutionCallback,

        /** Ran when error occurs before command */
        error?: CommandExceptionCallback,

        /** Whether a command is executed from a given message*/
        filter?: CommandFilter,

        /** Command arguments options */
        args?: {
            /** Argument name */
            name?: string

            /** Argument type */
            type?: CommandArgTypeString

            /** Argument choices */
            choices?: any[]

            /** Whether this argument is required */
            required?: boolean
        }[]

        

    }
}
