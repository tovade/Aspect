const AspectClient = require('./structures/AspectClient');
const config = require('../config.json');

const client = new AspectClient(config);
client.start();