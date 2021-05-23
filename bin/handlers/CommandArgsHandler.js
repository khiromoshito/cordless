const DiscordJS = require("discord.js");
const CommandExceptionType = require("../constants/CommandExceptionType");
const CommandArgCollection = require("../schema/CommandArgCollection");
const CommandArgsCompiledResponse = require("../schema/CommandArgsCompiledResponse");
const CommandArgument = require("../schema/CommandArgument");
const CommandOptions = require("../schema/CommandOptions");
const CommandExceptionHander = require("./CommandExceptionHandler");
const CommandArgType = require("../constants/CommandArgType");

var CommandArgsHandler = {
    /**
     * 
     * @param {DiscordJS.Message} message 
     * @param {CommandOptions} commandOptions 
     * @returns {CommandArgsCompiledResponse}
     */
    compileArgs: (message, commandOptions) => {
        let separatorRegex = new RegExp(/[ \n]/);

        let firstSeparatorPos = CommandArgsHandler.regexIndexOf(message.content, separatorRegex);
        if(!firstSeparatorPos) return new CommandArgsCompiledResponse(true, null, new CommandArgCollection());

        let argsStr = message.content.slice(firstSeparatorPos + 1).trim();



        if(commandOptions.length === 0)
            return new CommandArgsCompiledResponse(true, null, new CommandArgCollection([
                CommandArgsHandler._compileArg(message, argsStr)
            ]));

        let i = 0;  // Arg option index

        let compiledArgs = new CommandArgCollection();

        let argsOptions = commandOptions.argOptions;
        while(i < argsOptions.length && argsStr.length > 0) {
            let argOption = argsOptions[i];
            
            let arg;
            if(argOption.greedy) {
                arg = argsStr;
                argsStr = "";
            } else {
                let end = CommandArgsHandler.regexIndexOf(argsStr, separatorRegex); // arg end index
                arg = argsStr.slice(0, end);

                argsStr = argsStr.slice(end).trim();
            }

            let compiledArg = CommandArgsHandler._compileArg(message, arg, argOption);

            if(compiledArg.type!==argOption.type) {
                if(!argOption.required) i++;
                else return new CommandArgsCompiledResponse(false, 
                    CommandExceptionHander.evaluateException(commandOptions, CommandExceptionType.UNMATCHED_ARG, 
                        {pos: i, expectedType: argOption.type, foundType: compiledArg.type}));
            } else {
                if(argOption.choices && !argOption.choices.includes(compiledArg.value))
                    return new CommandArgsCompiledResponse(false, 
                        CommandExceptionHander.evaluateException(commandOptions, CommandExceptionType.INVALID_VALUE, 
                            {pos: i, value: compiledArg.text}));

                compiledArgs.push(compiledArg);
                i++;
            }
        }

        if(i < argsOptions.length) {
            for(; i<argsOptions.length; i++) 
                if(argsOptions[i].required)
                    return new CommandArgsCompiledResponse(false,
                        CommandExceptionHander.evaluateException(CommandExceptionType.LACK_ARGS));
        } else {
            if(argsStr.length > 0)
                return new CommandArgsCompiledResponse(false,
                    CommandExceptionHander.evaluateException(CommandExceptionType.EXCESS_ARGS));
        }

        

        

        return new CommandArgsCompiledResponse(true, null, compiledArgs);



    },

    regexIndexOf: (string, regex) => {
        return regex.exec(string)?.index || 0;
    },

    /**
     * Compiles argument string to `CommandArgument`
     * @param {DiscordJS.Message} message 
     * @param {String} arg 
     * @returns {CommandArgument}
     */
    _compileArg: (message, arg, options) => {
        let idRegex = new RegExp(/(?<=\<[\@\#]\!?)\d+(?=\>)/);
        if(idRegex.exec(arg)) {
            let id = idRegex.exec(arg)?.[0];
    
            if(message.mentions.users.has(id))
                return new CommandArgument(CommandArgType.USER, arg, 
                    message.mentions.users.get(id), options);
    
            if(message.mentions.members.has(id))
                return new CommandArgument(CommandArgType.MEMBER, arg, 
                    message.mentions.membrs.get(id), options);
    
            if(message.mentions.channels.has(id)) {
                let channel = message.mentions.channels.get(id);
                let channelTypes = {
                    "text": CommandArgType.TEXT_CHANNEL,
                    "voice": CommandArgType.VOICE_CHANNEL,
                    "news": CommandArgType.NEWS_CHANNEL
                };
                return new CommandArgument(channelTypes[channel.type] || CommandArgType.UNKNOWN_CHANNEL, arg, channel, options);
            }
        } else if(Number(arg)) {
            return new CommandArgument(CommandArgType.NUMBER, arg, Number(arg), options);
        }
    
        return new CommandArgument(CommandArgType.TEXT, arg, arg, options);
    
    }
};

module.exports = CommandArgsHandler;