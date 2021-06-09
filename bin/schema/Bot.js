const DiscordJS = require("discord.js");
const CommandArgsHandler = require("../handlers/CommandArgsHandler");
const ExceptionHandler = require("../handlers/ExceptionHandler");
const CommandMessage = require("./CommandMessage");
const CommandOptions = require("./CommandOptions");
const EventHandler = require("../handlers/EventHandler");
const MessageHandler = require("../handlers/MessageHandler");
const CommandsManager = require("./CommandsManager");




class Bot {


    /** 
     * Primary prefix for this bot
     * @returns {String} */
    get prefix() {}


    /**
     * This bot's list of prefixes
     * @returns {String[]}
     */
    prefixes = [];
    
    /**
     * @param {{commands,prefix:String|String[], init: (client: DiscordJS.Client) => Function}} 
     * @returns {Bot} */
    constructor(options = {}) {

        /** @type {DiscordJS.Client} */
        const client = new DiscordJS.Client();
        this.client = client;

        if(options.init) options.init(client);


        if(!"prefix" in options || options === null || options === undefined) {
            ExceptionHandler.warn("Empty prefix/es was provided for the bot. Prefix has been set to blank '' by default. With this, any messages starting with the command name is treated as a command by itself.");
            this.prefixes = [""];
        } else if(typeof options.prefix === "string")
            this.prefixes = [options.prefix];
        else if(options.prefix instanceof Array)
            this.prefixes = options.prefix;
        else 
            this.prefixes = [];


            
        // Listing commands

        /** 
         * Manages this bot's commands
         * @type {CommandsManager} */
        this.commands = new CommandsManager();

        for(let command of (options.commands || []))
            this.commands.list.push(
                command instanceof CommandOptions ? 
                command : new CommandOptions(command));



        // Setting unique id for bot (EventHandler)
        this.id = ++EventHandler.counter + "";
        EventHandler.clients[this.id] = {};

        

        // Rewiring event listeners
        client._on = client.on;
        client.on = (event, listener) => {
            if(event === "message")
                client._on("message", (message)=>listener(MessageHandler.process(this, message)));
            if(event === "commandError")
                EventHandler.push(this.id, "commandError", listener);
            else 
                client._on(event, listener);
        }

        client._on("message", (message)=>MessageHandler.process(this, message));
        


    }

}


module.exports = Bot;