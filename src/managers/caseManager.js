const { guildModel, caseModel } = require('../database/models/export/index');

async function updateCaseCount(message, client) {
    const guildDoc = await guildModel.findOne({ guildID: message.guild.id });

    guildDoc.caseCount += 1;

    await guildDoc.save();

    client.guildCache.set(message.guild.id, guildDoc);

    return guildDoc.caseCount;
}

async function createCaseDoc(msg, user, guild, action, caseNumber) {
    const caseDoc = new caseModel({
        guildID: guild.id,
        case: caseNumber,
        memberID: user.id,
        action: action,
        date: Date.now(),
        messageLink: msg.url,
    });

    await caseDoc.save().catch(err => console.log(err));
}

module.exports = {
    createCaseDoc,
    updateCaseCount,
};