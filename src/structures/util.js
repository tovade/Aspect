const { connect } = require('mongoose');
const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));

module.exports = class Util {

    constructor(client) {
        this.client = client;
    }

    async modlog(message, user, action, reason, color, length) {
        const caseManager = await require('../managers/caseManager')(message);

        const embed = {
            color: color,
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true, format: 'png' }),
            },
            author: {
                name: `${message.author.tag} - ${message.author.id}`,
                icon_url: message.author.displayAvatarURL({ dynamic: true, format: 'png' }),
            },
            description: `
                **Member:** ${user.tag} - ${user.id}
                **Action:** ${action}
                **Reason:** ${reason || 'Not specified'}
                ${length ? `**Length:** ${length}` : ''}
            `,
            timestamp: Date.now(),
            footer: {
                text: `Case: ${caseManager}`,
            },
        };

        const channel = message.guild.channels.cache.get('764566201895878676');
        channel.send({ embed: embed });
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

    async loadDatabase() {
        connect(this.client.dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(console.log('MongoDB Connected!'));
    }

}; 