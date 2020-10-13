const Event = require('../structures/bases/events');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true,
        });
    }

    async run() {
        console.log('Yo this is ready!');
    }
}; 