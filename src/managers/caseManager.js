const { guildModel, caseModel } = require('../database/models/export/index');

async function updateCaseCount(message, client) {
    const guildDoc = await guildModel.findOne({ guildID: message.guild.id });

    guildDoc.caseCount += 1;

    await guildDoc.save();

    client.guildCache.set(message.guild.id, guildDoc);

    return guildDoc.caseCount;
}

async function createCaseDoc(msg, user, guild, caseNumber, logArr) {
    const caseDoc = new caseModel({
        guildID: guild.id,
        case: caseNumber,
        memberID: user.id,
        logArr: logArr,
        date: Date.now(),
        messageLink: msg.url,
    });

    await caseDoc.save().catch(err => console.log(err));
}

module.exports = {
    createCaseDoc,
    updateCaseCount,
};