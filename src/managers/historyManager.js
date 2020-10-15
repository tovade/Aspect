const { historyModel } = require('../database/models/export/index');

const getAction = {
    'Kick': 'kicks',
    'Ban': 'bans',
    'Warn': 'warnings',
    'Mute': 'mutes',
    'Restrict': 'restrictions',
};

async function manageHistory(guild, user, action) {
    let historyDoc = await historyModel.findOne({
        guildID: guild.id,
        memberID: user.id,
    }).catch(err => console.log(err));

    if (!historyDoc) {
        historyDoc = new historyModel({
            guildID: guild.id,
            memberID: user.id,
        });
    }

    historyDoc[getAction[action]] += 1;

    await historyDoc.save().catch(err => console.log(err));
}

module.exports = {
    manageHistory,
};