const CommandArgType = require("../constants/CommandArgType");

class CommandArgOption {
    constructor(options = {}, index) {


        /** This argument's name (defaults to argument index)
         *  @type {String}
         */
        this.name = options.name || index+"";

        /**
         * This argument's type 
         * @type {String} */
        this.type = options.type || CommandArgType.TEXT;

        /** 
         * Available values that this command argument allows
         * @type {Object[]} */
        this.choices = options.choices;

        /**
         * Whether this argument is the collection of the rest of the command message words
         * @type {Boolean}
         */
        this.greedy = options.greedy || false;

        /**
         * Whether this argument is required
         * @type {Boolean}
         */
        this.required = options.required !== undefined ? options.required : true;

    }
}

module.exports = CommandArgOption;