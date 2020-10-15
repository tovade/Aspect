const { Schema, model, SchemaTypes } = require('mongoose');

const historyModel = Schema({
    guildID: {
        type: SchemaTypes.String,
        required: true,
    },
    memberID: {
        type: SchemaTypes.String,
        required: true,
    },
    warnings: {
        type: SchemaTypes.Number,
        default: 0,
    },
    restrictions: {
        type: SchemaTypes.Number,
        default: 0,
    },
    mutes: {
        type: SchemaTypes.Number,
        default: 0,
        required: true,
    },
    kicks: {
        type: SchemaTypes.Number,
        default: 0,
        required: true,
    },
    bans: {
        type: SchemaTypes.Number,
        default: 0,
        required: true,
    },
});

module.exports = model('history', historyModel);