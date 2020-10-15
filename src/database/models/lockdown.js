const { Schema, model, SchemaTypes } = require('mongoose');

const lockdownModel = Schema({
    guildID: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    channelID: {
        type: SchemaTypes.String,
        required: true,
    },
    length: {
        type: SchemaTypes.Date,
        required: true,
    },
});

module.exports = model('lockdown', lockdownModel);