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


    /** Gets the value of an argument by name 
     * @returns {String | Number | DiscordJS.User | DiscordJS.TextChannel | DiscordJS.NewsChannel | DiscordJS.VoiceChannel}
    */
    getValue(name) {
        return this.get(name)?.value;
    }

    /** Gets the original text value of an argument by name 
     * @returns {String}
    */
    getText(name) {
        return this.get(name)?.text;
    }
    
}

module.exports = CommandArgCollection;