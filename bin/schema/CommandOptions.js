const DiscordJS = require("discord.js");
const CommandArgType = require("../constants/CommandArgType");
const CommandExceptionType = require("../constants/CommandExceptionType");
const CommandExceptionHander = require("../handlers/CommandExceptionHandler");
const ExceptionHandler = require("../handlers/ExceptionHandler");
const CommandArgOption = require("./CommandArgOption");
const CommandArgument = require("./CommandArgument");
const CommandAttemptResponse = require("./CommandAttemptResponse");
const CommandException = require("./CommandException");

class CommandOptions {
    constructor(options = {}) {
        if(!"name" in options) ExceptionHandler.throw("A 'name' must be provided for a command");
        if(!"execute" in options) ExceptionHandler.throw("An 'execute' function must be provided for the command. This is called when the command is triggered. \n\nUsage: function(command) {...}\n\n");

        /**
         * Command name (primary trigger for command)
         * @type {String}
         */
        this.name = options.name;

        /**
         * Ran when command is triggered
         * @type {Function}
         */
        this.execute = options.execute;


        /**
         * Whether to execute command based on the message details
         * @type {Function<Boolean>}
         */
        this.filter = options.filter || ((_)=>true);

        /**
         * Other triggers for command
         * @type {String[]}
         */
        this.aliases = options.aliases || [];

        /**
         * Minimum number of arguments for command
         * @type {Number}
         */
        this.minArgs = options.minArgs || 0;

        /**
         * Maximum number of arguments for command
         * @type {Number}
         */
        this.maxArgs = options.maxArgs || Infinity;

        if(this.minArgs > this.maxArgs) ExceptionHandler.throw("'maxArgs' must not be less than 'minArgs'");

        /**
         * Options for every command argument
         * @type {CommandArgOption[]}
         */
        this.argOptions = (options.args || []).map((arg, i)=>{
            if(arg.greedy && i+1!==(options.args || []).length)
                    ExceptionHandler.throw("A greedy argument must be the last argument");

            return new CommandArgOption(arg, i);
        });





        /**
         * Ran when an error occurs from the command, including invalid arguments
         * and exceptions thrown by the `execute` method
         * @type {Function}
         */
        this.error = options.error || ((_,__)=>{});
    }


}

module.exports = CommandOptions;