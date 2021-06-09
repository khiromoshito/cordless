
const CommandOptions = require("./CommandOptions");
const CommandsCategory = require("./CommandsCategory");

class CommandsManager {
    constructor(commands = []) {
        /**
         * List of command options
         * @type {CommandOptions[]}
         */
        this.list = commands;
    }

    get size() {
        return this.list.length;
    }

    /** @returns {Map<String, CommandsCategory>} */
    get categories() {

        /** @type {Map<String, CommandsCategory>} */
        const categories = {};

        for(const command of this.list) {
            if(command.category === undefined) continue;

            const category = command.category.trim().toLowerCase();
            const categoryCommands = categories.get(category);
            
            if(categoryCommands) categoryCommands.commands.push(command);
            else categories.set(category, new CommandsCategory(category, [command]));
        }

        return categories;
    }

    /**
     * Gets a command from a given potential command trigger
     * @param {String} trigger 
     */
    findByTrigger(trigger) {
        for(const command of this.list)
            if(command.triggers.includes(trigger))
                return command;

        return null;
    }
}

module.exports = CommandsManager;