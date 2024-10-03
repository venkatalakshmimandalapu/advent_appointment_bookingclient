// src/models/Driver.ts
export class Driver {
    DriverId: number;     // This should match what you're using in the template
    DriverName: string;

    constructor(DriverId: number, DriverName: string) {
        this.DriverId = DriverId;
        this.DriverName = DriverName;
    }
}
