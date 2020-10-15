const Event = require('../structures/bases/events');
const { guildModel, lockdownModel } = require('../database/models/export/index');

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

            setInterval(async () => {
                const lockdownArray = await lockdownModel.find({ guildID: guild[0] });

                lockdownArray.forEach(async lockdown => {
                    if (Date.now() >= Number(lockdown.length)) {
                        const textChannel = guild[1].channels.cache.get(lockdown.channelID);

                        textChannel.updateOverwrite(guild[1].roles.everyone, { SEND_MESSAGES: true }).catch(err => console.log(err));

                        await lockdown.deleteOne();
                    }
                });
            }, 3000);
        }
    }
}; 