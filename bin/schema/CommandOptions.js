const DiscordJS = require("discord.js");
const CommandArgType = require("../constants/CommandArgType");
const CommandExceptionType = require("../constants/CommandExceptionType");
const CommandExceptionHander = require("../handlers/CommandExceptionHandler");
const ExceptionHandler = require("../handlers/ExceptionHandler");
const CommandArgOption = require("./CommandArgOption");
const CommandArgument = require("./CommandArgument");
const CommandAttemptResponse = require("./CommandAttemptResponse");
const CommandException = require("./CommandException");
const CommandMessage = require("./CommandMessage");

class CommandOptions {
    /**
     * @param {{name?: string, category?: string, description?: string, triggers?: string[], execute?: (command: CommandMessage)=>any,error?: (command: CommandMessage, error: CommandException)=>any, filter?: (message: DiscordJS.Message) => Boolean, permissions?: String[], args?: {name?: string, type?: String, choices?: any[], required?: boolean, greedy: Boolean}[]} options
     */
    constructor(options = {}) {

        const throwError = (message) => {
            const commandTag = `['${this.name}']`;
            const content = `${commandTag} ${message}`;

            ExceptionHandler.throw(content);
        }

        if(!"execute" in options) ExceptionHandler.throw("An 'execute' function must be provided for the command. This is called when the command is triggered. \n\nUsage: function(command) {...}\n\n");

        /**
         * Command name (primary trigger for command)
         * @type {String}
         */
        this.name = options.name;

        /**
         * Group to which this command belongs
         * @type {String}
         */
        this.category = options.category;

        /**
         * What this command does
         * @type {String}
         */
        this.description = options.description;

        /**
         * Ran when command is triggered
         * @type {Function}
         */
        this.execute = options.execute;


        /**
         * Required permissions from the command author before execution
         */
        this.permissions = options.permissions || [];

        /**
         * Whether to execute command based on the message details
         * @type {Function<Boolean>}
         */
        this.filter = options.filter || ((_)=>true);

        /**
         * Keywords for starting the command
         * @type {String[]}
         */
        this.triggers = options.triggers || [];

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

        if(this.minArgs > this.maxArgs) throwError("'maxArgs' must not be less than 'minArgs'");

        /**
         * Options for every command argument
         * @type {CommandArgOption[]}
         */
        this.argOptions = (options.args || []).map((arg, i)=>{
            if(arg.greedy && i+1!==(options.args || []).length)
                throwError("A greedy argument must be the last argument");

            return new CommandArgOption(arg, i);
        });





        /**
         * Ran when an error occurs from the command, including invalid arguments
         * and exceptions thrown by the `execute` method
         * @type {(command: CommandMessage, error: CommandException) => any}
         */
        this.error = options.error;
    }


    get requiredCommands() {
        return this.argOptions.filter(arg=>arg.required);
    }


}

module.exports = CommandOptions;