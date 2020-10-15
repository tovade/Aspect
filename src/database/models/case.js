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
    memberID: {
        type: SchemaTypes.String,
        required: true,
    },
    action: {
        type: SchemaTypes.String,
        required: true,
    },
    date: {
        type: SchemaTypes.Date,
        required: true,
    },
    messageLink: {
        type: SchemaTypes.String,
        required: true,
    },
});

module.exports = model('case', caseModel);