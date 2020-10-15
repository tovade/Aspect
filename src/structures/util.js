const { connect } = require('mongoose');
const { promisify } = require('util');
const path = require('path');
const glob = promisify(require('glob'));

module.exports = class Util {

    constructor(client) {
        this.client = client;
    }

    removeDuplicates(arr) {
        const data = [];

        arr.forEach(element => {
            if (data.includes(element)) return;
            else data.push(element);
        });

        return data;
    }

    capitalise(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    async modlog(message, user, client, action, reason, color, ref, length) {
        require('../managers/historyManager').manageHistory(message.guild, user, action);
        const caseManager = require('../managers/caseManager');

        const caseNumber = await caseManager.updateCaseCount(message, client);

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
                ${ref ? `**Ref:** ${ref}` : ''}
                ${length ? `**Length:** ${length}` : ''}
            `,
            timestamp: Date.now(),
            footer: {
                text: `Case: ${caseNumber}`,
            },
        };

        const channel = message.guild.channels.cache.get('764566201895878676');
        const msg = await channel.send({ embed: embed });

        await caseManager.createCaseDoc(msg, user, message.guild, caseNumber);
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