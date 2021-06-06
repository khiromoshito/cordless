const EventHandler = {
    counter: 0,
    clients: {},
    
    push: (clientId, event, listener) => {
        const clientEvents = EventHandler.clients[clientId];
        if(clientEvents[event]===undefined) clientEvents[event] = [];
        clientEvents[event].push(listener); 
    },

    emit: (clientId, event, args) => {
        for(const listener of ((EventHandler.clients[clientId]?.[event]) || [])) {
            listener(...args);
        }
    }
};

module.exports = EventHandler;