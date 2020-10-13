const { Client, Collection } = require('discord.js');
const Util = require('./util');

module.exports = class AspectClient extends Client {

    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
        });

        this.token = options.bot_token;

        this.prefix = options.prefix;

        this.commands = new Collection();

        this.events = new Collection();

        this.utils = new Util(this);
    }

    async start() {
        super.login(this.token);
        this.utils.loadCommands();
        this.utils.loadEvents();
    }
};