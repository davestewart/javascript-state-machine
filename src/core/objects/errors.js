export class ParseError extends Error {
    constructor(message, path, id) {
        super(message)
        this.path = path;
        this.id = id;
        this.name = 'ParseError';
    }
}
