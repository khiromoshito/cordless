const DiscordJS = require("discord.js");

class Message extends DiscordJS.Message {
    /**
     * 
     * @param {DiscordJS.Message} message 
     * @param {{isCommand: boolean}} options
     */
    constructor(message, options = {isCommand: false}) {

        super(message.client, message.toJSON(), message.channel);

        /** Original discord message instance. 
         * @type {DiscordJS.Message} */
        this.referenceMessage = message;


        /** Whether this message is a valid command. 
         * @type {Boolean} */
        this.isCommand = options.isCommand;

        this.referenceMessage.dissolve = (delay = 0) => {
            return new Promise((resolve, _)=>{
                if(this.referenceMessage.deletable) setTimeout(
                    async ()=>{
                        await this.referenceMessage.delete();
                        resolve(true)
                    }, Math.max(0, delay));
            });  
        };

        return this.referenceMessage;
    }

    /** Deletes this message after a timeout (in milliseconds) 
     * @param {Number} delay
    */
    async dissolve(delay = 0) {}
}

module.exports = Message;