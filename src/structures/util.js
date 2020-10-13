const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

module.exports = class Util {

    constructor(client) {
        this.client = client;
    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    async loadCommands() {
        return glob(`${this.directory}commands/**/*.js`).then(commands => {
            for (const commandFile of commands) {
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                const command = new File(this.client, name.toLowerCase());
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
            }
        });
    }

    async loadEvents() {
        return glob(`${this.directory}events/**/*.js`).then(events => {
            for (const eventFile of events) {
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                const event = new File(this.client, name.toLowerCase());
                this.client.events.set(event.name, event);
                event.emitter[event.type](name, (...args) => event.run(...args));
            }
        });
    }

}; 