const Command = require('../../structures/bases/command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'Display a list of all available commands!',
            category: 'Util',
        });
    }

    async execute(message, args) {
        const embed = {
            color: 'BLUE',
            fields: [],
        };

        const command = this.client.commands.get(args[0]);

        if (command) {
            embed.title = `\`${command.name} ${command.usage || ''}\``;

            embed.fields.push(
                {
                    name: '❯ Description',
                    value: command.description,
                },
            );

            if (command.examples.length) {
                embed.fields.push({
                    name: '❯ Examples',
                    value: command.examples.map(example => `\`${example}\``).join('\n'),
                    inline: true,
                });
            }

            if (command.aliases.length) {
                embed.fields.push({
                    name: '❯ Aliases',
                    value: command.aliases.map(alias => `\`${alias}\``).join(' '),
                    inline: true,
                });
            }
        }
        else {
            const categories = this.client.utils.removeDuplicates(this.client.commands.map(c => c.category));

            for (const category of categories) {
                embed.fields.push({
                    name: `❯ ${this.client.utils.capitalise(category)}`,
                    value: this.client.commands.filter(c => c.category === category).map(c => `\`${c.name}\``).join(' '),
                });
            }
        }

        message.channel.send({ embed: embed });
    }
};