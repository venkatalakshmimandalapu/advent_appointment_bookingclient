// src/models/Terminal.ts
export class Terminal {
    terminalId: number;   // Make sure this is correctly defined
    terminalName: string; // Ensure this property exists

    constructor(terminalId: number, terminalName: string) {
        this.terminalId = terminalId;
        this.terminalName = terminalName;
    }
}
