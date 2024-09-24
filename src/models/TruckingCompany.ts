import { Appointment } from "./Appointment";
import { Driver } from "./Driver";

export class TruckingCompany {
    trCompanyId: number;            // Corresponds to TrCompanyId
    trCompanyName: string;          // Corresponds to TrCompanyName
    gstNo?: string;                 // Corresponds to GstNo (optional)
    transportLicNo?: string;        // Corresponds to TransportLicNo (optional)
    email: string;                  // Corresponds to Email
    password: string;               // Corresponds to Password
    createdAt: Date;                // Corresponds to CreatedAt
    updatedAt: Date;                // Corresponds to UpdatedAt
    appointments?: Appointment[];    // Corresponds to Appointments (optional)
    drivers?: Driver[];              // Corresponds to Drivers (optional)

    constructor(
        trCompanyId: number,
        trCompanyName: string,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date,
        gstNo?: string,
        transportLicNo?: string,
        appointments?: Appointment[],
        drivers?: Driver[]
    ) {
        this.trCompanyId = trCompanyId;
        this.trCompanyName = trCompanyName;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.gstNo = gstNo;
        this.transportLicNo = transportLicNo;
        this.appointments = appointments;
        this.drivers = drivers;
    }
}

// Define Appointment and Driver classes as needed

