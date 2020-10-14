const Event = require('../structures/bases/events');
const { guildModel } = require('../database/models/export/index');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true,
        });
    }

    async run() {
        console.log('Yo this is ready!');

        for (const guild of this.client.guilds.cache) {
            let guildDoc = await guildModel.findOne({ guildID: guild[0] });

            if (!guildDoc) {
                guildDoc = new guildModel({
                    guildID: guild[0],
                });

                await guildDoc.save();
            }

            this.client.guildCache.set(guild[0], guildDoc);
        }
    }
}; 