const Command = require('../../structures/bases/command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'Display a list of all available commands!',
            category: 'Util',
        });
    }

    async execute(message) {
        const embed = {
            color: 'BLUE',
            fields: [],
        };

        const categories = this.client.utils.removeDuplicates(this.client.commands.map(c => c.category));

        for (const category of categories) {
            embed.fields.push({
                name: `❯ ${this.client.utils.capitalise(category)}`,
                value: this.client.commands.filter(c => c.category === category).map(c => `\`${c.name}\``).join(' '),
            });
        }


        message.channel.send({ embed: embed });
    }
};