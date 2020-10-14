const { Schema, model, SchemaTypes } = require('mongoose');

const caseModel = Schema({
    guildID: {
        type: SchemaTypes.String,
        required: true,
    },
    case: {
        type: SchemaTypes.Number,
        required: true,
    },
    committerID: {
        type: SchemaTypes.String,
        required: true,
    },
    messageLink: {
        type: SchemaTypes.String,
        required: true,
    },
});

module.exports = model('case', caseModel);