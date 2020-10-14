const { guildModel } = require('../database/models/export/index');

module.exports = async (message) => {
    const guildDoc = await guildModel.findOne({ guildID: message.guild.id });

    guildDoc.caseCount += 1;

    await guildDoc.save();

    return guildDoc.caseCount;
};