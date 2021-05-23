const CommandExceptionType = require("../constants/CommandExceptionType");
const CommandException = require("../schema/CommandException");
const CommandMessage = require("../schema/CommandMessage");

module.exports = {

    /**
     * Fetches `CommandException` from exception type
     * @param {CommandMessage} command
     * @param {number} type
     * @returns {CommandException}
     */
    evaluateException: (command, type, args = {}) => {
        if(type===CommandExceptionType.LACK_ARGS)
            return new CommandException(`Minimum of ${command.options.minArgs} arguments required, 
                but only ${command.args.length} found.`, type);

        if(type===CommandExceptionType.EXCESS_ARGS)
            return new CommandException(`Maximum of ${command.options.minArgs} arguments required, 
                but found ${command.args.length}.`, type);

        if(type===CommandExceptionType.UNMATCHED_ARG)
            return new CommandException(`Unmatched argument types at position ${args.pos} (expected '${args.expectedType}' but found '${args.foundType}')`, type);

        if(type===CommandExceptionType.INVALID_VALUE)
            return new CommandException(`Given argument '${args.value}' at position ${args.pos} is not a valid argument value (not found from choices)`, type);

        return new CommandException(`An unknown error occured`, type);
    },

};