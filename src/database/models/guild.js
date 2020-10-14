const { Schema, model, SchemaTypes } = require('mongoose');

const guildModel = Schema({
    guildID: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    prefix: {
        type: SchemaTypes.String,
        default: '!',
        required: true,
    },
    caseCount: {
        type: SchemaTypes.Number,
        default: 0,
        required: true,
    },
});

module.exports = model('guild', guildModel);