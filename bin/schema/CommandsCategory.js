const CommandOptions = require("./CommandOptions");

class CommandsCategory {
    constructor(name, commands = []) {
        
        /**
         * This category's name
         * @type {String}
         */
        this.name = name;


        /**
         * List of commands that belong to this category
         * @type {CommandOptions[]}
         */
        this.commands = commands;

    }
}

module.exports = CommandsCategory;