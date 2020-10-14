const { Schema, model, SchemaTypes } = require('mongoose');

const guildModel = Schema({
    guildID: {
        type: SchemaTypes.String,
        required: true,
    },
    prefix: {
        type: SchemaTypes.String,
        default: '!',
        required: true,
    },
});

module.exports = model('guild', guildModel);