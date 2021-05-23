module.exports = {
    throw: (message) => {
        throw new Error(`Cordless Exception: ${message}`);
    },

    warn: (message) => {
        console.log(`Cordless Warning: ${messge}`);
    }
}