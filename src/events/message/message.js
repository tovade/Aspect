const Event = require('../../structures/bases/events');
const { ownerID } = require('../../../config.json')
const memberRegex = RegExp(/<@!?(\d{17,19})>/);

module.exports = class extends Event {

    async run(message) {
        const guildDoc = this.client.guildCache.get(message.guild.id);

        if (guildDoc ? !message.content.startsWith(guildDoc.prefix) : null || message.bot || !message.guild) return;

        const [cmd, ...args] = message.content.slice(guildDoc.prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(cmd);

        if (!command) return;

        const memberID = memberRegex.test(args[0]) ? memberRegex.exec(args[0])[1] : args[0];
        const mentionedMember = message.guild.members.cache.get(memberID);

        if (command.requireMentioned) {
            if (!mentionedMember) {
                return message.channel.send(`You need to mention a member you want to \`${command.name}\``);
            }
        }
        if(command.ownerOnly && message.author.id !== ownerID) {
         return message.reply("You are not the owner!")
        }

        try {
            command.execute(message, args, mentionedMember);
        }
        catch (err) {
            console.log(err);
            message.channel.send('There seems to have been an error while executing this command.');
        }
    }
}; 