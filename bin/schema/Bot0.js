// const DiscordJS = require("discord.js");
// const CommandArgsHandler = require("../handlers/CommandArgsHandler");
// const ExceptionHandler = require("../handlers/ExceptionHandler");
// const CommandMessage = require("./CommandMessage");
// const CommandOptions = require("./CommandOptions");
// const EventHandler = require("../handlers/EventHandler");
// const MessageHandler = require("../handlers/MessageHandler");
// const CommandsManager = require("./CommandsManager");




// class Bot extends DiscordJS.Client {

//     /** 
//      * Manages this bot's commands
//      * @type {CommandsManager} */
//     commands;

//     /** 
//      * Primary prefix for this bot
//      * @returns {String} */
//     get prefix() {}

//     /**
//      * This bot's list of prefixes
//      * @returns {String[]}
//      */
//     prefixes;
    
//     /**
//      * @param {{commands,prefix:String|String[], init: (client: DiscordJS.Client) => Function}} 
//      * @returns {Bot} */
//     constructor(options = {}) {


//         /** @type {DiscordJS.Client} */
//         let client = new DiscordJS.Client();
         
//         if(options.init) options.init(client);


//         if(!"prefix" in options || options === null || options === undefined) {
//             ExceptionHandler.warn("Empty prefix/es was provided for the bot. Prefix has been set to blank '' by default. With this, any messages starting with the command name is treated as a command by itself.");
//             client.prefixes = [""];
//         } else if(typeof options.prefix === "string")
//             client.prefixes = [options.prefix];
//         else if(options.prefix instanceof Array)
//             client.prefixes = options.prefix;
//         else 
//             client.prefixes = [];


            
//         // Listing commands
//         client.commands = new CommandsManager();
//         for(let command of (options.commands || []))
//             client.commands.list.push(
//                 command instanceof CommandOptions ? 
//                 command : new CommandOptions(command));



//         // Setting unique id for bot (EventHandler)
//         client.id = ++EventHandler.counter + "";
//         EventHandler.clients[client.id] = {};

        

//         // Rewiring event listeners
//         client._on = client.on;
//         client.on = (event, listener) => {
//             if(event === "message")
//                 client._on("message", (message)=>listener(_onMessage(client, message)));
//             if(event === "commandError")
//                 EventHandler.push(client.id, "commandError", listener);
//             else 
//                 client._on(event, listener);
//         }

//         client._on("message", (message)=>MessageHandler.process(client, message));
        

//         return client;

//     }

// }


// module.exports = Bot;