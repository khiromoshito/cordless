const CommandExceptionType = require("../constants/CommandExceptionType");

class CommandException extends Error {
    constructor(message, type = CommandExceptionType.UNKNOWN) {
        super(message);
        this.type = type;
    }
}

module.exports = CommandException;