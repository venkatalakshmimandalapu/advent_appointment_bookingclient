import { Appointment } from "./Appointment";

export class Terminal {
    terminalId: number;            // Corresponds to TerminalId
    portName: string;              // Corresponds to PortName
    address: string;               // Corresponds to Address
    city: string;                  // Corresponds to City
    state?: string;                // Corresponds to State (optional)
    country: string;               // Corresponds to Country
    email: string;                 // Corresponds to Email
    password: string;              // Corresponds to Password
    createdAt: Date;               // Corresponds to CreatedAt
    updatedAt: Date;               // Corresponds to UpdatedAt
    appointments?: Appointment[];   // Corresponds to Appointments (optional)

    constructor(
        terminalId: number,
        portName: string,
        address: string,
        city: string,
        country: string,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date,
        state?: string,
        appointments?: Appointment[]
    ) {
        this.terminalId = terminalId;
        this.portName = portName;
        this.address = address;
        this.city = city;
        this.country = country;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.state = state;
        this.appointments = appointments;
    }
}

