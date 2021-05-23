const CommandArgument = require("./CommandArgument");

class CommandArgCollection extends Array {
    /**
     * @param {CommandArgument[]} args
     * @returns {CommandArgCollection} */
    constructor(args = []) {
        super();
        args.forEach(arg=>this.push(arg));
    }

    /** Fetches an argument with argument name 
     * @returns {CommandArgument}
    */
    get(name) {
        for(let item of this) {
            if(item.options.name===name) return item;
        }

        return null;
    }
}

module.exports = CommandArgCollection;