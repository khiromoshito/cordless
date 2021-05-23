
const CommandArgCollection = require("./CommandArgCollection");
const CommandException = require("./CommandException");


class CommandArgsCompiledResponse {
    /**
     * 
     * @param {Boolean} success 
     * @param {String | CommandException} exception 
     * @param {CommandArgCollection} args
     */
    constructor(success, exception = null, args = null) {
        /** 
         * Whether command attempt is successful
         * @type {Boolean} */
        this.success = success;

        /**
         * The exception for this command attempt 
         * @type {CommandException}*/ 
        this.exception = (typeof exception === "string") ? 
            new CommandException(exception) : 
            exception;

        /**
         * The compiled arguments for the command
         * @type {CommandArgCollection}
         */
        this.args = args;
    }
}

module.exports = CommandArgsCompiledResponse;