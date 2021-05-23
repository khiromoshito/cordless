
const CommandException = require("./CommandException");


class CommandAttemptResponse {
    /**
     * 
     * @param {Boolean} success 
     * @param {String | CommandException} exception 
     */
    constructor(success, exception = null, args = []) {
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
         * @type {String[]}
         */
        this.args = args;
    }
}

module.exports = CommandAttemptResponse;