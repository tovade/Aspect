const Command = require('../../structures/bases/command');
const { caseModel } = require('../../database/models/export/index');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reason',
            description: 'Change the reason for a case.',
            category: 'Moderation',
            usage: '<case> <reason>',
            examples: [
                'reason 123 Spamming',
                'reason 425 NSFW.',
            ],
        });
    }

    async execute(message, args) {
        const Case = !isNaN(args[0]) ? parseInt(args[0]) : null;
        const reason = args.slice(1).join(' ');

        if (!Case) {
            return message.channel.send('You need to specify a case to update the reason for.');
        }
        else if (!reason) {
            return message.channel.send('You need to give a new reason for this case.');
        }

        const caseDoc = await caseModel.findOne({
            guildID: message.guild.id,
            case: Case,
        });

        if (!caseDoc) {
            return message.channel.send('That is a invalid case number.');
        }

        // eslint-disable-next-line no-useless-escape
        const textChannelRegex = RegExp(`${message.guild.id}\/(\\d{17,19})\/`);
        const textChannelID = textChannelRegex.exec(caseDoc.messageLink)[1];
        // eslint-disable-next-line no-useless-escape
        const msgRegex = RegExp(`${textChannelID}\/(\\d{17,19})`);
        const msgID = msgRegex.exec(caseDoc.messageLink)[1];

        const textChannel = message.guild.channels.cache.get(textChannelID);

        if (!textChannel) {
            return message.channel.send('I can\'t find the channel this case was from.');
        }

        const msg = await textChannel.messages.fetch(msgID);

        if (!msg) {
            return message.channel.send('I can\'t find the message this case from from.');
        }

        const embed = msg.embeds[0];
        const descArray = embed.description.split('\n');
        descArray[2] = `**Reason:** ${reason}`;
        embed.description = descArray.join('\n');

        msg.edit({ embed: embed });

        message.channel.send(`Successfully set reason for case **#${caseDoc.case}**`);
    }
}; 