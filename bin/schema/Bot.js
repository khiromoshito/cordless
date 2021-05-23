const DiscordJS = require("discord.js");
const CommandArgsHandler = require("../handlers/CommandArgsHandler");
const ExceptionHandler = require("../handlers/ExceptionHandler");
const CommandMessage = require("./CommandMessage");
const CommandOptions = require("./CommandOptions");

class Bot extends DiscordJS.Client {

    /** 
     * This bot's collection of commands
     * @type {DiscordJS.Collection<String, CommandOptions>} */
    commands;

    /** 
     * Primary prefix for this bot
     * @returns {String} */
    get prefix() {}

    /**
     * This bot's list of prefixes
     * @returns {String[]}
     */
    prefixes;


    /**
     * @param {{commands,prefix:String|String[]}} 
     * @returns {Bot} */
    constructor(options = {}) {
         
        /** @type {DiscordJS.Client} */
        let client = new DiscordJS.Client();

        


        if(!"prefix" in options || options === null || options === undefined) {
            ExceptionHandler.warn("Empty prefix/es was provided for the bot. Prefix has been set to blank '' by default. With this, any messages starting with the command name is treated as a command by itself.");
            client.prefixes = [""];
        } else if(typeof options.prefix === "string")
            client.prefixes = [options.prefix];
        else if(options.prefix instanceof Array)
            client.prefixes = options.prefix;
        else 
            client.prefixes = [];


            
        let commands = new DiscordJS.Collection();
        for(let command of (options.commands || [])) {
            commands.set(command.name || "", new CommandOptions(command));
        }

        client.commands = commands;

        


       
        


        client._on = client.on;
        client.prefix = get => client.prefixes[0] || "";
        client.on = (event, listener) => {
            if(event === "message")
                client._on("message", (message)=>listener(_onMessage(client, message)));
            else 
                client._on(event, listener);
        }


        

        return client;

    }

}

 /**
 * 
 * Trims the prefix and trailing whitespace from content.
 * Returns null if message content is not a command.
 * 
 * @param {String} content 
 * @returns {String}
 */
function _trimPrefix (content, prefixes) {
    for(let prefix of prefixes)
        if(content.startsWith(prefix)) 
            return content.slice(prefix.length).trim();

    return null;
}


/**
 * 
 * @param {DiscordJS.Client} client 
 * @param {DiscordJS.Message} message 
 * @returns {Message} Extended Message object
 */
function _onMessage(client, message) {
    message.isCommand = false;
    message.bot = client;

    if(message.author.id === client.user.id) return message;

    let commandString = _trimPrefix(message.content, client.prefixes);
    if(!commandString) return message;

    let commandLine = commandString.split(/[ \n]+/);
    let commandOptions = findCommand(client.commands, commandLine[0]);

    if(!commandOptions) return message;
    if(!commandOptions.filter(message)) return message;


    let argsCompiledResponse = CommandArgsHandler.compileArgs(message, commandOptions);
    
    let commandMessage = new CommandMessage({
        bot: client,
        args: argsCompiledResponse.args,
        message,
        command: commandOptions
    });

    if(argsCompiledResponse.success) {
        commandOptions.execute(commandMessage);
    } else {
        commandOptions.error(commandMessage, argsCompiledResponse.exception);
    }
    

    message.isCommand = true;
    return message;
};

/**
 * Searches for command by name
 * @param {DiscordJS.Collection<String, CommandOptions>} commands 
 * @param {String} name 
 * @returns {CommandOptions}
 */
function findCommand(commands, name) {
    return commands.find(command=>command.name===name || command.aliases.includes(name));
}

module.exports = Bot;