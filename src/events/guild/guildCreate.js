const Event = require('../../structures/bases/events');
const { guildModel } = require('../../database/models/export/index');

module.exports = class extends Event {

    async run(guild) {
        const guildDoc = new guildModel({
            guildID: guild.id,
        });

        await guildDoc.save().catch(err => console.log(err));
    }
}; 