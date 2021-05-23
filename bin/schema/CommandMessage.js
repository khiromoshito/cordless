const DiscordJS = require("discord.js");
const Bot = require("./Bot");
const CommandOptions = require("./CommandOptions");
const ExceptionHandler = require("../handlers/ExceptionHandler");
const CommandArgument = require("./CommandArgument");
const CommandArgCollection = require("./CommandArgCollection");


class CommandMessage {
    constructor(options = {}) {

        if(!"message" in options) ExceptionHandler.throw("'message' must be provided for CommandMessage");
        

        /**
         * This bot
         * @type {Bot}
         */
        this.bot = options.bot;


        /**
         * Command arguments
         * @type {CommandArgCollection}
         */
        this.args = options.args || new CommandArgCollection();

        /**
         * Original message
         * @type {DiscordJS.Message}
         */
        this.message = options.message || null;

        /**
         * Command options
         * @type {CommandOptions}
         */
        this.options = options.command;





        // TAKEN FROM MESSAGE OBJECT

        /** @type {DiscordJS.User} */
        this.author = this.message.author;
        
        /** @type {DiscordJS.GuildMem]} */
        this.member = this.message.member;

        /** @type {DiscordJS.MessageType} */
        this.messageType = this.message.type;

        /** @type {DiscordJS.Client} */
        this.client = this.message.client;

        /** @type {DiscordJS.TextChannel | DiscordJS.DMChannel} */
        this.channel = this.message.channel;

        /** @type {DiscordJS.Guild} */
        this.guild = this.message.guild;
        
        
    }

    /**
     * Directly replies to command author's message
     * @returns {Promise<DiscordJS.Message>}
     */
    async reply(content) {
        return await this.message.reply(content);
    }

}

module.exports = CommandMessage;