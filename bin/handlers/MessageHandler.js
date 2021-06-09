const DiscordJS = require("discord.js");
const CommandExceptionType = require("../constants/CommandExceptionType");
const Bot = require("../schema/Bot");
const CommandException = require("../schema/CommandException");
const CommandMessage = require("../schema/CommandMessage");
const CommandOptions = require("../schema/CommandOptions");
const Message = require("../schema/Message");
const CommandArgsHandler = require("./CommandArgsHandler");
const CommandExceptionHandler = require("./CommandExceptionHandler");
const EventHandler = require("./EventHandler");

const MessageHandler = {
    /** 
     * @param {DiscordJS.Message} message
     * @param {Bot} bot
     * @returns {Message} Extended Message object
     */
    process: (bot, message) => {
        const extendedMessage = new Message(message);
        const client = bot.client;

        if(message.author.id === client.user.id) return extendedMessage;

        let commandString = MessageHandler._trimPrefix(message.content, bot.prefixes);
        if(!commandString) return extendedMessage;

        let commandLine = commandString.split(/[ \n]+/);
        let commandOptions = bot.commands.findByTrigger(commandLine[0]);

        if(!commandOptions) return message;
        if(!commandOptions.filter(message)) return extendedMessage;


        let argsCompiledResponse = CommandArgsHandler.compileArgs(message, commandOptions);


        let commandMessage = new CommandMessage({
            client, bot,
            args: argsCompiledResponse.args,
            message: extendedMessage,
            command: commandOptions
        });


        // Check permissions
        for(const perm of commandOptions.permissions) {
            if(!message.member.permissions.has(perm)) {
                MessageHandler.throwCommandError(commandMessage, 
                    CommandExceptionHandler.evaluateException(
                        commandOptions, CommandExceptionType.NO_PERMISSION));
                return extendedMessage;
            }       
        }
        
        

        if(argsCompiledResponse.success) {
            commandOptions.execute(commandMessage);
        } else {
            MessageHandler.throwCommandError(commandMessage, argsCompiledResponse.exception);
        }
        

        extendedMessage.isCommand = true;
        return extendedMessage;
    },


    /**
     * 
     * Trims the prefix and trailing whitespace from content.
     * Returns null if message content is not a command.
     * 
     * @param {String} content 
     * @returns {String}
     */
    _trimPrefix(content, prefixes) {
        for(let prefix of prefixes)
            if(content.startsWith(prefix)) 
                return content.slice(prefix.length).trim();

        return null;
    },



    /**
     * Searches for command by name
     * @param {DiscordJS.Collection<String, CommandOptions>} commands 
     * @param {String} name 
     * @returns {CommandOptions}
     */
    findCommand(commands, name) {
        return commands.find(command=>command.triggers.includes(name));
    },



    /**
     * 
     * @param {CommandMessage} commandMessage 
     * @param {CommandException} exception 
     */
    throwCommandError: (commandMessage, exception) => {
        if(commandMessage.options.error)
            commandMessage.options.error(commandMessage, exception);
        else EventHandler.emit(commandMessage.bot.id, "commandError", [commandMessage, exception]);
    }
};


module.exports = MessageHandler;