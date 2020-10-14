module.exports = class Command {

    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.description = options.description || null;
        this.aliases = options.aliases || [];
        this.examples = options.examples || [];
        this.usage = options.usage || null;
        this.category = options.category || null;
        this.requireMentioned = options.requireMentioned || null;
    }

}; 