const DiscordJS = require("discord.js");
const CommandArgOption = require("./CommandArgOption");

class CommandArgument extends String {
    
    constructor(type, text, value, options) {
        super(text || "");

        /** 
         * This argument's type
         * @type {String} */
        this.type = type;

        /**
         * This argument's original text value
         * @type {String}
         */
        this.text = text;

        /**
         * This argument's options (from bot command arguments)
         * @type {CommandArgOption}
         */
        this.options = options;

        /** 
         * Parsed value for the argument.
         * @type {String | Number | DiscordJS.User | DiscordJS.TextChannel | DiscordJS.NewsChannel | DiscordJS.VoiceChannel} */
        this.value = value;
    }
}

module.exports = CommandArgument;