const Event = require('../../structures/bases/events');

module.exports = class extends Event {

    async run(message) {
        const guildDoc = this.client.guildCache.get(message.guild.id);

        if (guildDoc ? !message.content.startsWith(guildDoc.prefix) : null || message.bot || !message.guild) return;

        const [cmd, ...args] = message.content.slice(guildDoc.prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(cmd);

        if (!command) return;

        try {
            command.execute(message, args);
        }
        catch (err) {
            console.log(err);
            message.channel.send('There seems to have been an error while executing this command.');
        }
    }
}; 