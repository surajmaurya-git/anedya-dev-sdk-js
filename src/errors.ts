

export class AnedyaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AnedyaError";
    }
}